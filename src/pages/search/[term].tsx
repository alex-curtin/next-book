import { GetServerSideProps } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import SearchLayout from "~/components/search-layout";
import BookItem from "~/components/book-item";
import { LoadingPage } from "~/components/loading";

const SearchResultsPage = ({ term }: { term: string }) => {
	const { data: searchResults, isLoading } = api.googleApi.searchBooks.useQuery(
		{
			term,
		},
		{ refetchOnWindowFocus: false },
	);

	if (isLoading) return <LoadingPage />;

	return (
		<div className="flex flex-col gap-4">
			{searchResults?.map((book) => (
				<Link
					key={book.googleId}
					className="flex gap-1 pr-2 py-1 hover:bg-black/10 transition"
					href={`/books/${book.googleId}`}
				>
					<BookItem book={book} />
				</Link>
			))}
		</div>
	);
};

export default SearchResultsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { term } = context.params;

	return {
		props: {
			term,
		},
	};
};

SearchResultsPage.getLayout = function getLayout(page) {
	return <SearchLayout>{page}</SearchLayout>;
};
