import { api } from "~/utils/api";
import PageLayout from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
import PageHeader from "~/components/ui/page-header";

const AllBooksPage = () => {
	const { data, isLoading } = api.books.getAll.useQuery();

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto gap-6">
				<PageHeader title="Popular Books" />
				{data?.map((book) => {
					return (
						<div key={book.bookData.id} className="w-full flex flex-col gap-1">
							<BookItem book={book.bookData} />
							<RatingSummary posts={book.posts} />
						</div>
					);
				})}
			</div>
		</PageLayout>
	);
};

export default AllBooksPage;
