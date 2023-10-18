import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import GuestFeed from "~/components/guest-feed";

import PageHeader from "~/components/ui/page-header";

const AllPostsPage = () => {
	return (
		<PageLayout>
			<div className="p-8">
				<div className="mb-4">
					<PageHeader title="All Posts" />
				</div>
				<GuestFeed />
			</div>
		</PageLayout>
	);
};

export default AllPostsPage;

export const getServerSideProps = async () => {
	const ssHelper = generateSSHelper();

	await ssHelper.posts.getAll.prefetchInfinite({ postsPerPage: 5 });

	return {
		props: {
			trpcState: ssHelper.dehydrate(),
		},
	};
};
