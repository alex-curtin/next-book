import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "../api/root";
import { db } from "../db/db";

export const generateSSHelper = () =>
	createServerSideHelpers({
		router: appRouter,
		ctx: { db, userId: null },
		transformer: superjson,
	});
