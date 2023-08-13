import { createTRPCRouter } from "./trpc";

import { googleApiRouter } from "./routers/google-api";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
	googleApi: googleApiRouter,
	posts: postsRouter,
	users: usersRouter,
});

export type AppRouter = typeof appRouter;
