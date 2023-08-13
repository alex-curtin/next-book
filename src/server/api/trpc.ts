import { TRPCError, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { getAuth } from "@clerk/nextjs/server";

import { db } from "../db/db";

export const createTRPCContext = (opts: CreateNextContextOptions) => {
	const { req } = opts;
	const session = getAuth(req);
	const { userId } = session;

	return {
		userId,
		db,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const checkUserIsAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			userId: ctx.userId,
		},
	});
});

export const privateProcedure = t.procedure.use(checkUserIsAuthed);
