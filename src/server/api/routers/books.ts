import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";
import { OpenAI } from "openai";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { books, bookCategories, categories } from "~/server/db/schema";

type Category = {
	id: number;
	name: string;
};

// const getCateogriesPrompt = (book: string, cats: Category[]) => `
//     From the following list of literary genres ${cats
// 			.map((cat) => `${cat.name} (id: ${cat.id})`)
// 			.join(", ")},
//       please select all that most accurately describe ${book}.
//   Please format the response as a JSON array with just the ids of the categories and no additional text
// `;

const getCateogriesPrompt = (book: string) => `
  What genre or genres is the book ${book}? Please format in a JSON array of strings.
`;

const getBookCategories = async (prompt: string) => {
	console.log("system prompt", prompt);
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo-16k",
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 0.3,
		top_p: 0.2,
	});
	console.log("openai response: ", response);
	const catString = response.choices[0].message.content;

	if (!catString) {
		return [];
	}
	console.log("openai completion", catString);

	const catArray: string[] = JSON.parse(catString);

	return catArray;
};

export const booksRouter = createTRPCRouter({
	getBookPostsByGoogleId: publicProcedure
		.input(
			z.object({
				googleId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.books.findFirst({
				where: eq(books.googleId, input.googleId),
				with: {
					posts: true,
				},
			});

			if (!data) {
				return [];
			}

			const users = await clerkClient.users.getUserList({
				userId: data.posts.map((post) => post.posterId),
			});

			const postsWithPosters = data.posts.map((post) => {
				const poster = users.find((user) => user.id === post.posterId);

				if (!poster || !poster.username) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Poster not found",
					});
				}

				return {
					...post,
					poster: {
						id: poster.id,
						username: poster.username,
						imageUrl: poster.imageUrl,
					},
				};
			});

			return postsWithPosters;
		}),

	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.books.findMany({
			orderBy: [desc(books.createdAt)],
			with: {
				bookAuthors: {
					with: {
						author: true,
					},
				},
				posts: true,
			},
		});

		const transformedBooks = data.map((book) => {
			const { bookAuthors, posts, ...bookData } = book;
			return {
				bookData: {
					...bookData,
					authors: bookAuthors.map((b) => b.author),
				},
				posts,
			};
		});

		return transformedBooks;
	}),

	assignCategories: publicProcedure
		.input(
			z.object({
				title: z.string(),
				id: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const prevCats = await ctx.db.query.bookCategories.findFirst({
				where: eq(bookCategories.bookId, input.id),
			});

			if (prevCats) {
				return;
			}

			// const allCats = await ctx.db.query.categories.findMany();
			const prompt = getCateogriesPrompt(input.title);
			const cats = await getBookCategories(prompt);
			console.log("open ai categories", cats);
			cats.forEach(async (cat) => {
				let category = await ctx.db.query.categories.findFirst({
					where: eq(categories.name, cat.toLowerCase()),
				});
				if (!category) {
					[category] = await ctx.db
						.insert(categories)
						.values({
							name: cat.toLowerCase(),
						})
						.returning();
				}

				await ctx.db.insert(bookCategories).values({
					bookId: input.id,
					categoryId: category.id,
				});
			});
		}),
});
