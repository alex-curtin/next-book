import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, asc, desc } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import {
	books,
	authors,
	bookAuthors,
	posts,
	type Post,
	type PostWithBooksAndAuthors,
} from "~/server/db/schema";

const addUsersToPosts = async (posts: Post[]) => {
	const users = await clerkClient.users.getUserList({
		userId: posts.map((post) => post.posterId),
	});
	const filteredUsers = users.map((user) => ({
		id: user.id,
		username: user.username,
		imageUrl: user.imageUrl,
	}));

	return posts.map((post) => {
		const poster = filteredUsers.find((user) => user.id === post.posterId);
		return {
			...post,
			poster,
		};
	});
};

export const authorsRouter = createTRPCRouter({
	getAllPostsBy: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const author = await ctx.db.query.authors.findFirst({
				where: eq(parseInt(input.id), authors.id),
				with: {
					bookAuthors: {
						with: {
							book: {
								with: {
									posts: true,
									bookAuthors: {
										with: {
											author: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!author) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Author not found",
				});
			}
			const posterIds = author.bookAuthors.flatMap(({ book }) =>
				book.posts.map((post) => post.posterId),
			);
			const users = await clerkClient.users.getUserList({
				userId: posterIds,
			});
			const filteredUsers = users.map((user) => ({
				id: user.id,
				username: user.username,
				imageUrl: user.imageUrl,
			}));

			const books = author.bookAuthors.map(({ book }) => {
				const { bookAuthors, posts, ...bookData } = book;
				return {
					bookData: {
						...bookData,
						authors: bookAuthors.map((b) => b.author),
					},
					posts: posts.map((post) => ({
						...post,
						poster: filteredUsers.find((user) => user.id === post.posterId),
					})),
				};
			});

			return {
				name: author.name,
				id: author.id,
				books,
			};
		}),
});
