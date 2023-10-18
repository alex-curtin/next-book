import { GetServerSideProps } from "next";

import { api } from "~/utils/api";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import NotFound from "~/components/not-found";
import BookItem from "~/components/book-item";
import RatingSummary from "~/components/rating-summary";
import PageHeader from "~/components/ui/page-header";

const CategoryPage = ({ id }: { id: string }) => {
	const { data: category, isLoading } = api.categories.getById.useQuery({ id });

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!category) {
		return <NotFound message="Category not found" />;
	}

	return (
		<PageLayout>
			<div className="p-8">
				<div className="pb-4">
					<PageHeader title={category.name} />
				</div>
				<div className="flex flex-wrap gap-4">
					{category.books.map((book) => (
						<div key={book.id} className="w-[300px]">
							<BookItem book={book} />
							<RatingSummary posts={book.posts} />
						</div>
					))}
				</div>
			</div>
		</PageLayout>
	);
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context.params?.id;

	if (typeof id !== "string") {
		throw new Error("Missing category id");
	}

	await ssHelper.categories.getById.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
