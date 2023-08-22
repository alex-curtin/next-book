import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";

const FeedPage = () => {
	const { data: postsData, isLoading } = api.posts.getUserFeed.useQuery();

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<h2 className="font-bold">Your Feed</h2>
				{isLoading && <LoadSpinner />}
				{postsData?.length ? (
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<div key={post.id}>
								<BookItem book={book} />
								<PostItem post={post} />
							</div>
						))}
					</div>
				) : (
					<p>No posts in your feed</p>
				)}
			</div>
		</PageLayout>
	);
};

export default FeedPage;

export const getServerSideProps = async () => {
	const ssHelper = generateSSHelper();

	await ssHelper.posts.getUserFeed.prefetch();

	return {
		props: {
			trpcState: ssHelper.dehydrate(),
		},
	};
};
