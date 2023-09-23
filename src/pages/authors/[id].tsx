import { GetServerSideProps } from "next";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
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
				<h2 className="text-lg font-semibold">Books by {author.name}</h2>
				{author.books.map(({ bookData, posts }) => (
					<div key={bookData.id} className="flex flex-col p-4 w-full">
						<BookItem book={bookData} />
						<RatingSummary posts={posts} />
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
