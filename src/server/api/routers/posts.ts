import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import { books, authors, bookAuthors, posts } from "~/server/db/schema";

export const postsRouter = createTRPCRouter({
	createPost: privateProcedure
		.input(
			z.object({
				book: z.object({
					imageUrl: z.string(),
					title: z.string(),
					subtitle: z.string().optional(),
					googleId: z.string(),
				}),
				authors: z.array(z.string()),
				post: z.object({
					content: z.string(),
					rating: z.number(),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let [book] = await ctx.db
				.select()
				.from(books)
				.where(eq(input.book.googleId, books.googleId));
			if (!book) {
				[book] = await ctx.db
					.insert(books)
					.values({
						title: input.book.title,
						subtitle: input.book.subtitle || "",
						imageUrl: input.book.imageUrl,
						googleId: input.book.googleId,
					})
					.returning();
				input.authors.forEach(async (author) => {
					let [newAuthor] = await ctx.db
						.select()
						.from(authors)
						.where(eq(author, authors.name));
					if (!newAuthor) {
						[newAuthor] = await ctx.db
							.insert(authors)
							.values({
								name: author,
							})
							.returning();
					}
					await ctx.db.insert(bookAuthors).values({
						authorId: newAuthor.id,
						bookId: book.id,
					});
				});
			}

			const [newPost] = await ctx.db
				.insert(posts)
				.values({
					content: input.post.content,
					rating: input.post.rating,
					posterId: ctx.userId,
					bookId: book.id,
				})
				.returning();

			return newPost;
		}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const post = await ctx.db.query.posts.findFirst({
				where: eq(parseInt(input.id), posts.id),
				with: {
					book: {
						with: {
							bookAuthors: {
								columns: {
									bookId: false,
									authorId: false,
								},
								with: {
									author: true,
								},
							},
						},
					},
				},
			});
			return post;
		}),
});
