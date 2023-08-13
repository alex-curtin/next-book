import { z } from "zod";
import { TRPCError } from "@trpc/server";
import axios, { AxiosResponse } from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

type GoogleBooksResult = {
	id: string;
	volumeInfo: {
		authors: string[];
		imageLinks: {
			thumbnail: string;
		};
		title: string;
		subtitle: string | null;
	};
};

export type Book = {
	authors: string[];
	imgUrl: string;
	title: string;
	subtitle: string;
	googleId: string;
};

const transformBooks = (books: GoogleBooksResult[]): Book[] => {
	return books.map((book) => {
		const { volumeInfo, id } = book;
		return {
			authors: volumeInfo?.authors || [],
			imgUrl: volumeInfo?.imageLinks?.thumbnail,
			title: volumeInfo?.title,
			subtitle: volumeInfo?.subtitle || null,
			googleId: id,
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
			const { data } = await axios.get(
				`${BASE_URL}?q=${input.term}&key=${process.env.GOOGLE_API_KEY}`,
			);

			return transformBooks(data.items);
		}),

	getBookById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			// workaround - google api get volume by id not working
			const { data } = await axios.get(
				`${BASE_URL}?q=${input.id}&key=${process.env.GOOGLE_API_KEY}`,
			);
			const transformedBooks = transformBooks(data.items);

			return transformedBooks.find((book) => book.googleId === input.id);
		}),
});
