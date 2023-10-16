import { api } from "~/utils/api";
import { LoadSpinner } from "~/components/loading";
import PostFeedItem from "./post-feed-item";

const GuestFeed = () => {
	const { data: postsData, isLoading } = api.posts.getAll.useQuery();

	return (
		<div className="flex flex-col mx-auto">
			{isLoading && (
				<div className="w-full py-4 flex justify-center">
					<LoadSpinner size={48} />
				</div>
			)}
			{postsData?.length && (
				<div className="flex flex-col gap-2">
					{postsData.map(({ post, book }) => (
						<PostFeedItem key={post.id} book={book} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default GuestFeed;
