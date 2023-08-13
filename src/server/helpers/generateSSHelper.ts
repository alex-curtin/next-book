import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "../api/root";

export const generateSSHelper = () =>
	createServerSideHelpers({
		router: appRouter,
		ctx: { userId: null },
		transformer: superjson,
	});
