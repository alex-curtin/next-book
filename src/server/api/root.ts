import { createTRPCRouter } from "./trpc";

import { googleApiRouter } from "./routers/google-api";

export const appRouter = createTRPCRouter({
	googleApi: googleApiRouter,
});

export type AppRouter = typeof appRouter;
