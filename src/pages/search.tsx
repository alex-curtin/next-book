import { useSearchParams } from "next/navigation";

import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";
import SearchLayout from "~/components/search-layout";
import { api } from "~/utils/api";

const SearchPage = () => {
	const search = useSearchParams();
	const searchTerm = search.get("q") || "";

	const {
		data: searchResults,
		isFetching,
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
		<SearchLayout>
			<div className="flex flex-col gap-6 max-w-2xl">
				{isFetching && <LoadSpinner size={48} />}
				{searchResults?.pages.map((page) => (
					<>
						{page?.books.map((book) => (
							<div key={book.googleId} className="flex gap-2 pr-2 py-1">
								<BookItem book={book} />
							</div>
						))}
					</>
				))}
				{searchResults &&
					(isFetchingNextPage ? (
						<div className="w-full flex justify-center">
							<LoadSpinner size={24} />
						</div>
					) : (
						<button
							type="button"
							className="text-slate-600 font-bold text-sm"
							onClick={() => fetchNextPage()}
						>
							load more
						</button>
					))}
			</div>
		</SearchLayout>
	);
};

export default SearchPage;
