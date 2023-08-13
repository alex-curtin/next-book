import { type GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { DEFAULT_IMG_URL } from "~/constants";
import { Textarea } from "~/components/ui/textarea";
import { type Book, getBookById, searchBooks } from "~/lib/books-api";
import { Button } from "~/components/ui/button";
import StarIcon from "~/components/ui/icons/star-icon";
import Link from "next/link";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api } from "~/utils/api";
import PageLayout from "~/components/layout";

const AddPost = ({ book }: { book: Book }) => {
	const router = useRouter();
	const [postContent, setPostContent] = useState("");
	const [rating, setRating] = useState(1);
	const { mutate } = api.posts.createPost.useMutation({
		onSuccess: (post) => {
			console.log("success");
			router.push(`/posts/${post.id}`);
		},
	});

	const onClickCreate = async () => {
		if (postContent.length) {
			console.log(postContent);
			await mutate({
				book: {
					title: book.title,
					subtitle: book.subtitle || "",
					imageUrl: book.imgUrl,
					googleId: book.googleId,
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
				cols="30"
				rows="10"
				value={postContent}
				placeholder="Write a review"
				onChange={(e) => setPostContent(e.target.value)}
			/>
			<Button onClick={onClickCreate} disabled={!postContent.length}>
				Create Review
			</Button>
		</div>
	);
};

const SingleBookPage = ({ id }: { id: string }) => {
	const { isSignedIn } = useUser();
	const { data: book } = api.googleApi.getBookById.useQuery({ id });

	if (!book) return <div>404...can't find that book</div>;

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 gap-2">
				<div className="flex gap-2">
					<Image
						src={book.imgUrl || DEFAULT_IMG_URL}
						width={96}
						height={96}
						alt={book.title}
					/>
					<div>
						<h2 className="text-xl">{book.title}</h2>
						<h3>{book.subtitle}</h3>
						<p className="text-black/80">{book.authors.join(" | ")}</p>
					</div>
				</div>
				{isSignedIn ? (
					<AddPost book={book} />
				) : (
					<div>
						<Link href="/signin">Sign in</Link> to create a post
					</div>
				)}
			</div>
		</PageLayout>
	);
};

export default SingleBookPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context.params.id;

	if (!id) throw new Error("no id");

	await ssHelper.googleApi.getBookById.prefetch({ id });

	return {
		props: {
			trpcState: ssHelper.dehydrate(),
			id,
		},
	};
};
