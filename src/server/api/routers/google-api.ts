import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios, { AxiosResponse } from "axios";
import { desc, eq } from "drizzle-orm";
import { OpenAI } from "openai";
import { Redis } from "@upstash/redis";

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { DEFAULT_IMG_URL } from "~/constants";
import { posts } from "~/server/db/schema";

const redis = Redis.fromEnv();

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

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

type UserRecommendationsCache = {
	userBooks: string;
	recommendations: Book[];
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

const getOpenAIRecommendations = async (prompt: string, maxTokens = 1024) => {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	console.log("requesting from OpenAI");
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 1,
		max_tokens: maxTokens,
	});
	console.log("openai response: ", response);
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

	return transformedBooks;
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

			const prompt = `Please recommend 5 books for someone who liked ${input.book}. Format as a JSON array of strings, ie "[title - author]".`;

			const bookRecs = await getOpenAIRecommendations(prompt);

			await redis.set(input.book, JSON.stringify(bookRecs));

			return bookRecs;
		}),

	getUserRecommendations: privateProcedure.query(async ({ ctx }) => {
		const userPosts = await ctx.db.query.posts.findMany({
			where: eq(posts.posterId, ctx.userId),
			orderBy: [desc(posts.createdAt)],
			with: {
				book: {
					with: {
						bookAuthors: {
							with: {
								author: true,
							},
						},
					},
				},
			},
		});

		if (!userPosts.length) {
			return [];
		}

		const userBooks = userPosts
			.map((post) => {
				const title = post.book.title;
				const author = post.book.bookAuthors[0].author.name;
				return `${title} - ${author}`;
			})
			.join("; ");

		const cache: UserRecommendationsCache | null = await redis.get(ctx.userId);

		if (cache) {
			if (cache.userBooks === userBooks) {
				return cache.recommendations;
			}
		}

		const prompt = `Please recommend 5 books for someone who read the following books: ${userBooks}. Be sure not to repeat any books from that list. Format as a JSON array of strings, ie "[title - author]".`;
		const bookRecs = await getOpenAIRecommendations(prompt, 512);

		await redis.set(
			ctx.userId,
			JSON.stringify({
				userBooks,
				recommendations: bookRecs,
			}),
			{ px: day },
		);

		return bookRecs;
	}),
});
