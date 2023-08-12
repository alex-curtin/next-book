import { type GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";

import { DEFAULT_IMG_URL } from "~/constants";
import { Textarea } from "~/components/ui/textarea";
import { type Book, getBookById, searchBooks } from "~/lib/books-api";
import { Button } from "~/components/ui/button";
import StarIcon from "~/components/ui/icons/star-icon";

const AddPost = () => {
	const [postContent, setPostContent] = useState("");
	const [rating, setRating] = useState(1);

	const onClickCreate = () => {
		if (postContent.length) {
			console.log(postContent);
		}
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex">
				{Array.from({ length: 5 }).map((_, i) => (
					<button type="button" onClick={() => setRating(i + 1)}>
						{/* rome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
						<StarIcon filled={i < rating} key={i} />
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

const SingleBookPage = (props: { id: string; book: Book }) => {
	const { book } = props;

	if (!book) return <div>404...can't find that book</div>;

	return (
		<main className="flex flex-col items-center p-4 gap-2">
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
			<AddPost />
		</main>
	);
};

export default SingleBookPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.params.id;
	try {
		// workaround - google api get volume by id not working
		const books = await searchBooks(id);
		const book = books.find((book) => book.googleId === id);
		return {
			props: {
				id,
				book,
			},
		};
	} catch (error) {
		return {
			props: {
				id,
				book: null,
			},
		};
	}
};
