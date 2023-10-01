import Link from "next/link";
import { api } from "~/utils/api";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { LoadSpinner } from "~/components/loading";

const GuestDash = () => {
	const { data: postsData, isLoading } = api.posts.getAll.useQuery();

	return (
		<div>
			<div className="text-center p-4">
				<p>
					<Link href="/signin" className="text-blue-700">
						Sign in
					</Link>{" "}
					or{" "}
					<Link href="/signup" className="text-blue-700">
						create an account
					</Link>{" "}
					to rate and review your favorite books and follow other users
				</p>
				<p>
					or feel free to discover books by{" "}
					<Link href="/books" className="text-blue-700">
						browsing
					</Link>{" "}
					or{" "}
					<Link href="/search" className="text-blue-700">
						searching
					</Link>{" "}
					or checking out some user reviews
				</p>
			</div>
			<div className="flex flex-col p-4 max-w-2xl mx-auto">
				{isLoading && <LoadSpinner />}
				{!isLoading && postsData?.length && (
					<>
						<h3 className="font-semibold mb-2">Preview Feed</h3>
						<div className="flex flex-col gap-2">
							{postsData.map(({ post, book }) => (
								<div key={post.id}>
									<BookItem book={book} />
									<PostItem post={post} />
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default GuestDash;
