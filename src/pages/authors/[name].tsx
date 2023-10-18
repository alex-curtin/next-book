import { GetServerSideProps } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
import { LoadSpinner, LoadingPage } from "~/components/loading";
import PageHeader from "~/components/ui/page-header";
import { Button } from "~/components/ui/button";
import LoadMore from "~/components/ui/load-more";

const SingleAuthorPage = ({ name }: { name: string }) => {
	const { data: author, isLoading } = api.authors.getByName.useQuery({
		name,
	});

	let titles: string[] = [];

	if (author) {
		titles = author.books.map((book) => book.bookData.title);
	}

	const {
		data: googleBooks,
		fetchNextPage,
		isLoading: isLoadingGoogleBooks,
		isFetchingNextPage,
	} = api.googleApi.getBooksByAuthor.useInfiniteQuery(
		{
			author: name,
			titles,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	if (isLoading) return <LoadingPage />;

	return (
		<PageLayout>
			<div className="flex flex-col p-8">
				<div className="pl-4 pb-4">
					<PageHeader title={name} />
				</div>
				<div className="mb-8 min-w-[640px]">
					<h2 className="self-start font-semibold px-4">
						{author?.books.length ? "User Reviewed" : "No reviews yet"}
					</h2>
					<div className="flex">
						{author?.books.map(({ bookData, posts }) => (
							<div key={bookData.id} className="flex flex-col p-4 w-72">
								<BookItem book={bookData} />
								<Link href={`/books/${bookData.googleId}`}>
									<RatingSummary posts={posts} />
								</Link>
							</div>
						))}
					</div>
				</div>
				{isLoadingGoogleBooks && <LoadSpinner size={36} />}
				{googleBooks?.pages.length && (
					<div className="w-full">
						<h2 className="self-start font-semibold px-4">
							{author?.books.length ? `More by ${name}` : `Books by ${name}`}
						</h2>
						<div className="flex flex-wrap gap-2">
							{googleBooks?.pages.map((page) =>
								page.books.map((book) => (
									<div key={book.googleId} className="w-72 p-4">
										<BookItem book={book} />
									</div>
								)),
							)}
						</div>
						<div className="flex justify-center">
							<LoadMore action={fetchNextPage}>
								{isFetchingNextPage && (
									<div className="w-full flex justify-center py-2">
										<LoadSpinner size={24} />
									</div>
								)}
							</LoadMore>
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
	const name = context?.params?.name;

	if (typeof name !== "string") {
		throw new Error("Missing name");
	}

	await ssHelper.authors.getByName.prefetch({ name });

	return {
		props: {
			name,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
