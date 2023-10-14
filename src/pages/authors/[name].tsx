import { GetServerSideProps } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
import { LoadSpinner, LoadingPage } from "~/components/loading";
import PageHeader from "~/components/ui/page-header";

const SingleAuthorPage = ({ name }: { name: string }) => {
	const { data: author, isLoading } = api.authors.getByName.useQuery({
		name,
	});

	let titles: string[] = [];
	if (author) {
		titles = author.books.map((book) => book.bookData.title);
	}

	const { data: googleBooks, isLoading: isLoadingGoogleBooks } =
		api.googleApi.getBooksByAuthor.useQuery({
			author: name,
			titles,
		});

	if (isLoading) return <LoadingPage />;

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto">
				<PageHeader title={`Books by ${name}`} />
				<div className="mb-8 min-w-[640px]">
					<h3 className="self-start font-semibold px-4">
						{author?.books.length ? "User Reviewed:" : "No reviews yet"}
					</h3>
					{author?.books.map(({ bookData, posts }) => (
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
					<div className="w-full">
						<h3 className="self-start font-semibold px-4">
							{author?.books.length ? `Other books by ${name}:` : ""}
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
