import PageLayout from "~/components/layout";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";

const Home = () => {
	const { data: postsData, isLoading } = api.posts.getAll.useQuery();

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<h2 className="font-bold">Latest Posts</h2>
				{isLoading && <LoadSpinner />}
				{postsData?.length && (
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<div>
								<BookItem book={book} key={book.id} />
								<PostItem key={post.id} post={post} />
							</div>
						))}
					</div>
				)}
			</div>
		</PageLayout>
	);
};

export default Home;
