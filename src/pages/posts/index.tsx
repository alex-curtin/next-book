import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";

import PageHeader from "~/components/ui/page-header";

const AllPostsPage = () => {
	const { data: postsData, isLoading } = api.posts.getAll.useQuery();

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<PageHeader title="Recent Posts" />
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
					<p>No posts</p>
				)}
			</div>
		</PageLayout>
	);
};

export default AllPostsPage;

export const getServerSideProps = async () => {
	const ssHelper = generateSSHelper();

	await ssHelper.posts.getAll.prefetch();

	return {
		props: {
			trpcState: ssHelper.dehydrate(),
		},
	};
};
