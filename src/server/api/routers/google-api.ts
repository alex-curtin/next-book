import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios, { AxiosResponse } from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { DEFAULT_IMG_URL } from "~/constants";

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
			}),
		)
		.query(async ({ input }) => {
			if (!input.term) return;
			const { data }: { data: { items: GoogleBooksResult[] } } =
				await axios.get(
					`${BASE_URL}?q=${input.term}&key=${process.env.GOOGLE_API_KEY}`,
				);

			return transformBooks(data.items);
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
});
