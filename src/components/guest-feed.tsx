import { api } from "~/utils/api";
import { LoadSpinner } from "~/components/loading";
import PostFeedItem from "./post-feed-item";
import LoadMore from "./ui/load-more";

const GuestFeed = () => {
	const {
		data: postsData,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
	} = api.posts.getAll.useInfiniteQuery(
		{
			postsPerPage: 5,
		},
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
			{postsData?.pages.length && (
				<div className="flex flex-col gap-2">
					{postsData.pages.map((page) =>
						page.feed.map(({ book, post }) => (
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
			)}
		</div>
	);
};

export default GuestFeed;
