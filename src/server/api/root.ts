import { createTRPCRouter } from "./trpc";

import { googleApiRouter } from "./routers/google-api";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";
import { authorsRouter } from "./routers/authors";
import { booksRouter } from "./routers/books";
import { followsRouter } from "./routers/follows";
import { categoriesRouter } from "./routers/categories";

export const appRouter = createTRPCRouter({
	googleApi: googleApiRouter,
	posts: postsRouter,
	users: usersRouter,
	authors: authorsRouter,
	books: booksRouter,
	follows: followsRouter,
	categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
