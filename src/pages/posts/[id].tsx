import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api } from "~/utils/api";

import PageLayout from "~/components/layout";
import NotFound from "~/components/not-found";
import BookItem from "~/components/book-item";
import PostItem from "~/components/post-item";

dayjs.extend(relativeTime);

const SinglePostPage = ({ id }: { id: string }) => {
	const { data: postData } = api.posts.getById.useQuery({ id });

	if (!postData) return <NotFound message="Post not found" />;

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<div className="flex flex-col gap-2">
					<div>
						<BookItem key={postData.book.id} book={postData.book} />
						<PostItem key={postData.post.id} post={postData.post} />
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default SinglePostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context.params?.id;

	if (typeof id !== "string") {
		throw new Error("Missing id");
	}

	await ssHelper.posts.getById.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
