import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/", "/(.*)", "/search-books"],
	ignoredRoutes: ["/((?!api|trpc))(_next|.+..+)(.*)"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
