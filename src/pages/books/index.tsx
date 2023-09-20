import { api } from "~/utils/api";
import PageLayout from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import BookItem from "~/components/book-item";
import StarIcon from "~/components/ui/icons/star-icon";

const AllBooksPage = () => {
	const { data, isLoading } = api.books.getAll.useQuery();

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto gap-6">
				<h2>Recently reviewed books</h2>
				{data?.map((book) => {
					const reviewCount = book.posts.length;
					const avgRating = Math.ceil(
						book.posts.reduce((acc, cur) => acc + cur.rating, 0) / reviewCount,
					);

					return (
						<div key={book.bookData.id} className="w-full flex flex-col gap-1">
							<BookItem book={book.bookData} />
							<div className="flex gap-1 text-sm items-center">
								<div className="flex items-center">
									<span className="mr-1">Average rating:</span>
									{Array.from({ length: 5 }).map((_, i) => (
										// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<StarIcon key={i} filled={i < avgRating} />
									))}
								</div>
								<p>
									{book.posts.length} review{book.posts.length === 1 ? "" : "s"}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</PageLayout>
	);
};

export default AllBooksPage;
