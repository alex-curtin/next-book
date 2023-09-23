import { type GetServerSideProps } from "next";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { DEFAULT_IMG_URL } from "~/constants";
import { Textarea } from "~/components/ui/textarea";
import { type Book } from "~/server/api/routers/google-api";
import { Button } from "~/components/ui/button";
import StarIcon from "~/components/ui/icons/star-icon";
import Link from "next/link";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api } from "~/utils/api";
import PageLayout from "~/components/layout";
import NotFound from "~/components/not-found";
import BookItem from "~/components/book-item";
import PostItem from "~/components/post-item";

const AddPost = ({ book }: { book: Book }) => {
	const router = useRouter();
	const [postContent, setPostContent] = useState("");
	const [rating, setRating] = useState(3);
	const { mutate } = api.posts.createPost.useMutation({
		onSuccess: (post) => {
			toast("Post created!");
			router.push(`/posts/${post.id}`);
		},
	});

	const onClickCreate = () => {
		if (postContent.length) {
			mutate({
				book: {
					title: book.title,
					subtitle: book.subtitle || "",
					imageUrl: book.imageUrl || DEFAULT_IMG_URL,
					googleId: book.googleId,
					description: book.description || "",
				},
				authors: book.authors,
				post: {
					content: postContent,
					rating,
				},
			});
		}
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex">
				{Array.from({ length: 5 }).map((_, i) => (
					// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<button type="button" onClick={() => setRating(i + 1)} key={i}>
						<StarIcon filled={i < rating} />
					</button>
				))}
			</div>
			<Textarea
				name="post"
				cols={60}
				rows={10}
				value={postContent}
				placeholder="Write a post about this book"
				onChange={(e) => setPostContent(e.target.value)}
			/>
			<Button onClick={onClickCreate} disabled={!postContent.length}>
				Post
			</Button>
		</div>
	);
};

const SingleBookPage = ({ id }: { id: string }) => {
	const { isSignedIn } = useUser();
	const { data: book } = api.googleApi.getBookById.useQuery({ id });

	if (!book) return <NotFound message="Book not found" />;

	const { data: posts } = api.books.getBookPostsByGoogleId.useQuery({
		googleId: book.googleId,
	});

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl m-auto">
				<div className="flex flex-col p-4 gap-4">
					<BookItem book={book} />
					{isSignedIn ? (
						<AddPost book={book} />
					) : (
						<div>
							<Link href="/signin">Sign in</Link> to create a post
						</div>
					)}
					<div>
						{posts
							?.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
							.map((post) => (
								<PostItem key={post.id} post={post} />
							))}
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default SingleBookPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context.params?.id;

	if (typeof id !== "string") throw new Error("Missing id");

	await ssHelper.googleApi.getBookById.prefetch({ id });

	return {
		props: {
			trpcState: ssHelper.dehydrate(),
			id,
		},
	};
};
