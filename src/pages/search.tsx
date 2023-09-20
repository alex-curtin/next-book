import { useSearchParams } from "next/navigation";

import BookItem from "~/components/book-item";
import { LoadingPage } from "~/components/loading";
import SearchLayout from "~/components/search-layout";
import { api } from "~/utils/api";
import { type Page } from "./_app";

const SearchPage = () => {
	const search = useSearchParams();
	const searchTerm = search.get("q") || "";

	const { data: searchResults, isLoading } = api.googleApi.searchBooks.useQuery(
		{ term: searchTerm },
		{ refetchOnWindowFocus: false, enabled: !!searchTerm },
	);

	if (isLoading && searchTerm) {
		return <LoadingPage />;
	}

	if (searchResults) {
		return (
			<div className="flex flex-col gap-6 max-w-2xl">
				{searchResults?.map((book) => (
					<div key={book.googleId} className="flex gap-2 pr-2 py-1">
						<BookItem book={book} />
					</div>
				))}
			</div>
		);
	}

	return null;
};

export default SearchPage;

SearchPage.getLayout = function getLayout(page: Page) {
	return <SearchLayout>{page}</SearchLayout>;
};
