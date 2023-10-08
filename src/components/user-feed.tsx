import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";

const UserFeed = () => {
	const { data: postsData, isLoading } = api.posts.getUserFeed.useQuery();
	const { data: recommendations } =
		api.googleApi.getUserRecommendations.useQuery(undefined, { retry: false });

	return (
		<div className="flex flex-col p-4 max-w-2xl mx-auto">
			{isLoading && <LoadSpinner />}
			{recommendations?.length && (
				<>
					<h3 className="font-semibold mb-2">Recommended for you</h3>
					<div className="flex flex-col gap-4 mb-4">
						{recommendations.map((book) => (
							<div key={book.googleId}>
								<BookItem book={book} />
							</div>
						))}
					</div>
				</>
			)}
			{!isLoading && postsData?.length ? (
				<>
					<h3 className="font-semibold mb-2">Your Feed</h3>
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<div key={post.id}>
								<BookItem book={book} />
								<PostItem post={post} />
							</div>
						))}
					</div>
				</>
			) : (
				<div>
					<p>No posts in your feed</p>
				</div>
			)}
		</div>
	);
};

export default UserFeed;
