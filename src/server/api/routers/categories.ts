import { inArray, eq } from "drizzle-orm";
import { z } from "zod";

import { categories } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { RouterOutputs } from "~/utils/api";
import { TRPCError } from "@trpc/server";

const primaryCategories = [
	"mystery",
	"science fiction",
	"non-fiction",
	"young adult",
	"classic",
	"fantasy",
	"biography",
	"horror",
];

export const categoriesRouter = createTRPCRouter({
	getPrimary: publicProcedure.query(async ({ ctx }) => {
		const catsWithBooks = await ctx.db.query.categories.findMany({
			where: inArray(categories.name, primaryCategories),
			with: {
				bookCategories: {
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

		const filteredCats = catsWithBooks
			.filter((cat) => cat.bookCategories.length > 2)
			.map((cat) => {
				const count = cat.bookCategories.length;
				const books = cat.bookCategories
					.slice(0, 6)
					.map((bc) => {
						const { bookAuthors, ...bookData } = bc.book;

						return {
							...bookData,
							authors: bookAuthors.map((ba) => ba.author),
						};
					})
					.sort((a, b) => b.posts.length - a.posts.length);

				return {
					name: cat.name,
					id: cat.id,
					books,
					count,
				};
			})
			.sort((a, b) => b.count - a.count);

		return filteredCats;
	}),

	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const category = await ctx.db.query.categories.findFirst({
				where: eq(categories.id, parseInt(input.id)),
				with: {
					bookCategories: {
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

			if (!category) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error fetching category",
				});
			}

			const books = category?.bookCategories
				.map((bc) => {
					const { bookAuthors, ...bookData } = bc.book;

					return {
						...bookData,
						authors: bookAuthors.map((ba) => ba.author),
					};
				})
				.sort((a, b) => b.posts.length - a.posts.length);

			return {
				id: category.id,
				name: category.name,
				books,
			};
		}),
});
