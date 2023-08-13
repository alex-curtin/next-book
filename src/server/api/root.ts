import { createTRPCRouter } from "./trpc";

import { googleApiRouter } from "./routers/google-api";
import { postsRouter } from "./routers/posts";

export const appRouter = createTRPCRouter({
	googleApi: googleApiRouter,
	posts: postsRouter,
});

export type AppRouter = typeof appRouter;
