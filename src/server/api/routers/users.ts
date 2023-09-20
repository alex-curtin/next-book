import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { follows } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const user = await clerkClient.users.getUser(input.id);

			if (!user.username) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Username not found",
				});
			}

			const followers = await ctx.db.query.follows.findMany({
				where: eq(follows.followedId, user.id),
			});

			const following = await ctx.db.query.follows.findMany({
				where: eq(follows.followerId, user.id),
			});

			const followerIds = followers.map((f) => f.followerId);
			const followingIds = following.map((f) => f.followedId);

			return {
				id: user.id,
				username: user.username,
				imageUrl: user.imageUrl,
				createdAt: user.createdAt,
				followers: followerIds,
				following: followingIds,
			};
		}),
});
