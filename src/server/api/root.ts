import { createTRPCRouter } from "./trpc";

import { googleApiRouter } from "./routers/google-api";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";
import { authorsRouter } from "./routers/authors";

export const appRouter = createTRPCRouter({
	googleApi: googleApiRouter,
	posts: postsRouter,
	users: usersRouter,
	authors: authorsRouter,
});

export type AppRouter = typeof appRouter;
