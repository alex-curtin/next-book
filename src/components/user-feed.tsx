import { api } from "~/utils/api";
import PostFeedItem from "./post-feed-item";
import { LoadSpinner } from "./loading";

const UserFeed = () => {
	const { data: postsData, isLoading } = api.posts.getUserFeed.useQuery();

	return (
		<div className="flex flex-col mx-auto">
			{isLoading && (
				<div className="w-full py-4 flex justify-center">
					<LoadSpinner size={48} />
				</div>
			)}
			{postsData &&
				(postsData.length > 0 ? (
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<PostFeedItem key={post.id} book={book} post={post} />
						))}
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
