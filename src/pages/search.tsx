import { useSearchParams } from "next/navigation";
import Link from "next/link";

import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";
import { LoadingPage } from "~/components/loading";
import SearchLayout from "~/components/search-layout";
import { api } from "~/utils/api";

const SearchPage = () => {
	const search = useSearchParams();
	const searchTerm = search.get("q");

	const { data: searchResults, isLoading } = api.googleApi.searchBooks.useQuery(
		{ term: searchTerm },
		{ refetchOnWindowFocus: false, enabled: !!searchTerm },
	);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (searchResults) {
		return (
			<div className="flex flex-col gap-4 max-w-2xl">
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
	}

	return <></>;
};

export default SearchPage;

SearchPage.getLayout = function getLayout(page) {
	return <SearchLayout>{page}</SearchLayout>;
};
