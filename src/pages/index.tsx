import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner, LoadingPage } from "~/components/loading";

const Home = () => {
	const router = useRouter();
	const { isSignedIn, isLoaded } = useUser();

	if (isSignedIn) {
		router.push("/feed");
	}

	const { data: postsData, isLoading } = api.posts.getAll.useQuery();

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<h2 className="font-bold">Latest Posts</h2>
				{isLoading && <LoadSpinner />}
				{postsData?.length && (
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<div key={post.id}>
								<BookItem book={book} />
								<PostItem post={post} />
							</div>
						))}
					</div>
				)}
			</div>
		</PageLayout>
	);
};

export default Home;
