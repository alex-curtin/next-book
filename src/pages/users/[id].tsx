import { api } from "~/utils/api";
import { GetServerSideProps } from "next";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";

const SingleUserPage = ({ id }: { id: string }) => {
	const { data: postsData, isLoading } = api.posts.getAllByUser.useQuery({
		id,
	});
	const { data: user, isLoading: isLoadingUser } = api.users.getById.useQuery({
		id,
	});

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				{!isLoading && user && (
					<h2 className="font-bold">Posts by {user.username}</h2>
				)}
				{isLoading && <div>loading...</div>}
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
					<p>This user has not made any posts yet</p>
				)}
			</div>
		</PageLayout>
	);
};

export default SingleUserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params;
	const ssHelper = generateSSHelper();

	await ssHelper.posts.getAllByUser.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
