import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import { follows } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const user = await clerkClient.users.getUser(input.id);

			const followers = await ctx.db.query.follows.findMany({
				where: eq(user.id, follows.followedId),
			});

			const following = await ctx.db.query.follows.findMany({
				where: eq(user.id, follows.followerId),
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
