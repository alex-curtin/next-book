import { GetServerSideProps } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
import NotFound from "~/components/not-found";
import { LoadSpinner, LoadingPage } from "~/components/loading";
import PageHeader from "~/components/ui/page-header";

const SingleAuthorPage = ({ id }: { id: string }) => {
	const { data: author, isLoading } = api.authors.getAllPostsBy.useQuery({
		id,
	});

	if (isLoading) return <LoadingPage />;
	if (!author) return <NotFound message="Author not found" />;

	const titles = author.books.map((book) => book.bookData.title);
	const { data: googleBooks, isLoading: isLoadingGoogleBooks } =
		api.googleApi.getBooksByAuthor.useQuery({
			author: author.name,
			titles,
		});

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto">
				<PageHeader title={`Books by ${author.name}`} />
				<div className="mb-8 min-w-[640px]">
					<h3 className="self-start font-semibold px-4">User Reviewed:</h3>
					{author.books.map(({ bookData, posts }) => (
						<div key={bookData.id} className="flex flex-col p-4 w-full">
							<BookItem book={bookData} />
							<Link href={`/books/${bookData.googleId}`}>
								<RatingSummary posts={posts} />
							</Link>
						</div>
					))}
				</div>
				{isLoadingGoogleBooks && <LoadSpinner size={36} />}
				{googleBooks?.length && (
					<div>
						<h3 className="self-start font-semibold px-4">
							Other books by {author.name}:
						</h3>
						<div className="flex flex-col gap-2 p-4">
							{googleBooks?.map((book) => (
								<div key={book.googleId}>
									<BookItem book={book} />
								</div>
							))}
						</div>
					</div>
				)}
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
