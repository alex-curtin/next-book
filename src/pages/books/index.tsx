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
			<div className="flex flex-col p-4 lg:px-16">
				<div className="mb-4">
					<PageHeader title="All Reviewed Books" />
				</div>
				<div className="flex flex-wrap gap-4">
					{data?.map((book) => {
						return (
							<div
								key={book.bookData.id}
								className="flex flex-col gap-1 w-[300px]"
							>
								<BookItem book={book.bookData} />
								<RatingSummary posts={book.posts} />
							</div>
						);
					})}
				</div>
			</div>
		</PageLayout>
	);
};

export default AllBooksPage;
