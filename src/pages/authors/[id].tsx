import { GetServerSideProps } from "next";
import Image from "next/image";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import PostItem from "~/components/post-item";
import NotFound from "~/components/not-found";
import { LoadingPage } from "~/components/loading";

const SingleAuthorPage = ({ id }: { id: string }) => {
	const { data: author, isLoading } = api.authors.getAllPostsBy.useQuery({
		id,
	});

	if (isLoading) return <LoadingPage />;
	if (!author) return <NotFound message="Author not found" />;

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto">
				<h2 className="text-lg font-semibold">{author.name}</h2>
				{author.books.map(({ bookData, posts }) => (
					<div key={bookData.id} className="flex flex-col p-4">
						<BookItem book={bookData} />
						<div>
							{posts
								.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
								.map((post) => (
									<PostItem key={post.id} post={post} />
								))}
						</div>
					</div>
				))}
			</div>
		</PageLayout>
	);
};

export default SingleAuthorPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context?.params?.id;

	if (typeof id !== "string") {
		throw new Error("Missing id");
	}

	await ssHelper.authors.getAllPostsBy.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
