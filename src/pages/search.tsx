import { useSearchParams } from "next/navigation";

import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";
import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import SearchBar from "~/components/search-bar";
import LoadMore from "~/components/ui/load-more";

const SearchPage = () => {
	const search = useSearchParams();
	const searchTerm = search.get("q") || "";

	const {
		data: searchResults,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
	} = api.googleApi.searchBooks.useInfiniteQuery(
		{ term: searchTerm, maxResults: 20, pageParam: 0 },
		{
			getNextPageParam: (lastPage) => lastPage?.nextCursor,
			refetchOnWindowFocus: false,
			enabled: !!searchTerm,
		},
	);

	return (
		<PageLayout>
			<div className="flex flex-col items-center px-8 gap-8 pt-8">
				<div className="w-2/3">
					<SearchBar />
				</div>
				{isLoading && searchTerm && <LoadSpinner size={48} />}
				<div className="flex flex-wrap gap-2">
					{searchResults?.pages.map((page) =>
						page?.books.map((book) => (
							<div key={book.googleId} className="w-72 p-4">
								<BookItem book={book} />
							</div>
						)),
					)}
				</div>
				{searchResults &&
					(isFetchingNextPage ? (
						<div className="w-full flex justify-center">
							<LoadSpinner size={24} />
						</div>
					) : (
						<LoadMore action={fetchNextPage}>
							<button
								type="button"
								className="text-slate-600 font-bold text-sm"
								onClick={() => fetchNextPage()}
							>
								load more
							</button>
						</LoadMore>
					))}
			</div>
		</PageLayout>
	);
};

export default SearchPage;
