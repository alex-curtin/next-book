import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, privateProcedure } from "../trpc";
import { follows } from "~/server/db/schema";

export const followsRouter = createTRPCRouter({
	follow: privateProcedure
		.input(
			z.object({
				followedId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const follow = await ctx.db.insert(follows).values({
				followerId: ctx.userId,
				followedId: input.followedId,
			});
		}),

	unfollow: privateProcedure
		.input(
			z.object({
				followedId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const unfollow = await ctx.db
				.delete(follows)
				.where(
					and(
						eq(follows.followerId, ctx.userId),
						eq(follows.followedId, input.followedId),
					),
				);
		}),
});
