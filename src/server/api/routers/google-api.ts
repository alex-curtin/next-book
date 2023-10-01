import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios, { AxiosResponse } from "axios";
import { OpenAI } from "openai";
import { Redis } from "@upstash/redis";

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { DEFAULT_IMG_URL } from "~/constants";

const redis = Redis.fromEnv();

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const cleanHTMLString = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, "");

type GoogleBooksResult = {
	id: string;
	volumeInfo: {
		authors?: string[];
		imageLinks: {
			thumbnail: string;
		};
		title: string;
		subtitle: string | null;
		description?: string;
	};
};

export type Book = {
	authors: { name: string; id?: number }[];
	imageUrl: string;
	title: string;
	subtitle: string;
	googleId: string;
	description: string;
};

const transformBooks = (books: GoogleBooksResult[]): Book[] => {
	return books.map((book) => {
		const { volumeInfo, id } = book;
		return {
			authors: volumeInfo?.authors?.map((author) => ({ name: author })) || [],
			imageUrl: volumeInfo?.imageLinks?.thumbnail || DEFAULT_IMG_URL,
			title: volumeInfo?.title,
			subtitle: volumeInfo?.subtitle || "",
			googleId: id,
			description: volumeInfo.description
				? cleanHTMLString(volumeInfo.description)
				: "",
		};
	});
};

export const googleApiRouter = createTRPCRouter({
	searchBooks: publicProcedure
		.input(
			z.object({
				term: z.string(),
				maxResults: z.number().default(20),
				pageParam: z.number().default(0),
				cursor: z.number().nullish(),
			}),
		)
		.query(async ({ input }) => {
			if (!input.term) return;
			const { data }: { data: { items: GoogleBooksResult[] } } =
				await axios.get(
					`${BASE_URL}?q=${input.term}&maxResults=${
						input.maxResults
					}&startIndex=${input.cursor || 0}&key=${process.env.GOOGLE_API_KEY}`,
				);

			return {
				books: transformBooks(data.items),
				nextCursor: (input.cursor || 0) + 20,
			};
		}),

	getBookById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const { data }: { data: GoogleBooksResult } = await axios.get(
				`${BASE_URL}/${input.id}?key=${process.env.GOOGLE_API_KEY}`,
			);
			const [transformedBook] = transformBooks([data]);

			return transformedBook;
		}),

	getBooksByAuthor: publicProcedure
		.input(
			z.object({
				author: z.string(),
				titles: z.array(z.string()),
			}),
		)
		.query(async ({ input }) => {
			const { data }: { data: { items: GoogleBooksResult[] } } =
				await axios.get(
					`${BASE_URL}?q=${input.author}&maxResults=20&&key=${process.env.GOOGLE_API_KEY}`,
				);

			const transformedBooks = transformBooks(data.items);
			const filteredBooks = transformedBooks
				.filter((book) =>
					book.authors.some((author) => author.name === input.author),
				)
				.filter((book) => !input.titles.includes(book.title));

			return filteredBooks.slice(0, 10);
		}),

	getRecommendations: publicProcedure
		.input(
			z.object({
				book: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const cache: Book[] | null = await redis.get(input.book);
			if (cache) {
				return cache;
			}

			const openai = new OpenAI({
				apiKey: process.env.OPENAI_API_KEY,
			});

			console.log("requesting from OpenAI");
			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "user",
						content: `Please recomment 5 books for someone who liked ${input.book}. Format as a JSON array of strings, ie "[title - author]".`,
					},
				],
				temperature: 1,
				max_tokens: 256,
			});

			const recString = response.choices[0].message.content;

			if (!recString) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get recommendations",
				});
			}

			const recsArray: string[] = JSON.parse(recString);

			const googleBooks = await Promise.all(
				recsArray.map((rec) => {
					const response: Promise<{ data: { items: GoogleBooksResult[] } }> =
						axios.get(
							`${BASE_URL}?q=${rec}&maxResults=1&&key=${process.env.GOOGLE_API_KEY}`,
						);
					return response;
				}),
			);

			const books = googleBooks.map((rec) => rec.data.items[0]);

			const transformedBooks = transformBooks(books);

			await redis.set(input.book, JSON.stringify(transformedBooks));

			return transformedBooks;
		}),
});
