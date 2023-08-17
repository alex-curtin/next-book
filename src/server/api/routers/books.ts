import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, asc, desc } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import {
	books,
	authors,
	bookAuthors,
	posts,
	type Post,
	type PostWithBooksAndAuthors,
} from "~/server/db/schema";

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

				if (!poster) {
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
});
