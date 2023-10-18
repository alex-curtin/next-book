import { api } from "~/utils/api";
import PostFeedItem from "./post-feed-item";
import { LoadSpinner } from "./loading";
import LoadMore from "./ui/load-more";

const UserFeed = () => {
	const {
		data: postsData,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
	} = api.posts.getUserFeed.useInfiniteQuery(
		{ postsPerPage: 5 },
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return (
		<div className="flex flex-col mx-auto">
			{isLoading && (
				<div className="w-full py-4 flex justify-center">
					<LoadSpinner size={48} />
				</div>
			)}
			{postsData &&
				(postsData.pages.length > 0 ? (
					<div className="flex flex-col gap-2">
						{postsData.pages.map((page) =>
							page.feed.map(({ post, book }) => (
								<PostFeedItem key={post.id} book={book} post={post} />
							)),
						)}
						<LoadMore action={fetchNextPage}>
							{isFetchingNextPage && (
								<div className="w-full flex justify-center px-2">
									<LoadSpinner size={24} />
								</div>
							)}
						</LoadMore>
					</div>
				) : (
					<div className="text-center">
						<p>Nothing in your feed! Follow some users to see their posts.</p>
					</div>
				))}
		</div>
	);
};

export default UserFeed;
