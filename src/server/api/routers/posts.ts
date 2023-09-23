import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, inArray } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import {
	books,
	authors,
	bookAuthors,
	posts,
	follows,
} from "~/server/db/schema";

type PostWithBooksAndAuthors = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	bookId: number;
	posterId: string;
	content: string;
	rating: number;
	book: {
		id: number;
		createdAt: Date | null;
		updatedAt: Date | null;
		title: string;
		subtitle: string | null;
		imageUrl: string | null;
		googleId: string;
		description: string | null;
		bookAuthors: {
			bookId: number;
			authorId: number;
			author: {
				id: number;
				name: string;
			};
		}[];
	};
};

const formatPosts = async (posts: PostWithBooksAndAuthors[]) => {
	const users = await clerkClient.users.getUserList({
		userId: posts.map((post) => post.posterId),
	});

	return posts.map((post) => {
		const poster = users.find((user) => user.id === post.posterId);

		if (!poster || !poster.username) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Poster not found",
			});
		}
		const { book, ...postData } = post;
		const { bookAuthors, ...bookData } = book;
		const transformedBook = {
			...bookData,
			authors: bookAuthors.map((b) => b.author),
		};

		return {
			post: {
				...postData,
				poster: {
					id: poster.id,
					username: poster.username,
					imageUrl: poster.imageUrl,
				},
			},
			book: transformedBook,
		};
	});
};

export const postsRouter = createTRPCRouter({
	createPost: privateProcedure
		.input(
			z.object({
				book: z.object({
					imageUrl: z.string(),
					title: z.string(),
					subtitle: z.string().optional(),
					googleId: z.string(),
					description: z.string().optional(),
				}),
				authors: z.array(z.object({ name: z.string() })),
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
				.where(eq(books.googleId, input.book.googleId));
			if (!book) {
				[book] = await ctx.db
					.insert(books)
					.values({
						title: input.book.title,
						subtitle: input.book.subtitle || "",
						imageUrl: input.book.imageUrl,
						googleId: input.book.googleId,
						description: input.book.description || "",
					})
					.returning();
				input.authors.forEach(async (author) => {
					let [newAuthor] = await ctx.db
						.select()
						.from(authors)
						.where(eq(authors.name, author.name));
					if (!newAuthor) {
						[newAuthor] = await ctx.db
							.insert(authors)
							.values({
								name: author.name,
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
				where: eq(posts.id, parseInt(input.id)),
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

			if (!post) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Post not found",
				});
			}

			const [formattedPost] = await formatPosts([post]);

			return formattedPost;
		}),

	getAll: publicProcedure.query(async ({ ctx }) => {
		const allPosts = await ctx.db.query.posts.findMany({
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

		const formattedPosts = formatPosts(allPosts);

		return formattedPosts;
	}),

	getAllByUser: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const userPosts = await ctx.db.query.posts.findMany({
				where: eq(posts.posterId, input.id),
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

			const formattedPosts = formatPosts(userPosts);

			return formattedPosts;
		}),

	getByBookId: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const bookPosts = await ctx.db.query.posts.findMany({
				where: eq(posts.bookId, parseInt(input.id)),
			});

			const users = await clerkClient.users.getUserList({
				userId: bookPosts.map((post) => post.posterId),
			});

			const postsWithPosters = bookPosts.map((post) => {
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

	getUserFeed: privateProcedure.query(async ({ ctx }) => {
		const following = await ctx.db.query.follows.findMany({
			where: eq(follows.followerId, ctx.userId),
		});

		const followinIds = following.map((f) => f.followedId);

		const postFeed = await ctx.db.query.posts.findMany({
			where: inArray(posts.posterId, [...followinIds, ctx.userId]),
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

		const formattedFeed = await formatPosts(postFeed);

		return formattedFeed;
	}),

	edit: privateProcedure
		.input(
			z.object({
				id: z.number(),
				content: z.string(),
				rating: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const updatedPost = await ctx.db
				.update(posts)
				.set({
					content: input.content,
					rating: input.rating,
					updatedAt: new Date(),
				})
				.where(eq(posts.id, input.id));
		}),

	delete: privateProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const deletedPost = await ctx.db
				.delete(posts)
				.where(eq(posts.id, input.id));
		}),
});
