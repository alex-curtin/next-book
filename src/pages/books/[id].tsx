import { useEffect } from "react";
import { type GetServerSideProps } from "next";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Image from "next/image";

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
import { LoadSpinner, LoadingPage } from "~/components/loading";
import RatingSummary from "~/components/rating-summary";
import HorizontalScroller from "~/components/ui/horizontal-scroller";

const AddPost = ({ book }: { book: Book }) => {
	const ctx = api.useContext();
	const [postContent, setPostContent] = useState("");
	const [rating, setRating] = useState(3);
	const { mutate, isLoading, isSuccess } = api.posts.createPost.useMutation({
		onSuccess: () => {
			toast("Post created!");
			ctx.books.getBookPostsByGoogleId.invalidate({ googleId: book.googleId });
		},
	});

	useEffect(() => {
		if (isSuccess) {
			ctx.googleApi.getUserRecommendations.prefetch();
		}
	}, [isSuccess]);

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
		<div className="flex justify-center">
			<div className="w-full  flex flex-col gap-1">
				<div className="flex">
					{Array.from({ length: 5 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<button type="button" onClick={() => setRating(i + 1)} key={i}>
							<StarIcon filled={i < rating} />
						</button>
					))}
				</div>
				<Textarea
					name="post"
					cols={60}
					rows={5}
					value={postContent}
					placeholder="Review this book"
					onChange={(e) => setPostContent(e.target.value)}
					disabled={isLoading}
				/>
				<div className="self-end">
					<Button
						onClick={onClickCreate}
						disabled={!postContent.length || isLoading}
					>
						{isLoading ? <LoadSpinner /> : "Post"}
					</Button>
				</div>
			</div>
		</div>
	);
};

const SingleBookPage = ({ id }: { id: string }) => {
	const { isSignedIn, user } = useUser();
	const { data: book, isLoading: isLoadingBook } =
		api.googleApi.getBookById.useQuery({ id });

	if (!book) return <NotFound message="Book not found" />;

	if (isLoadingBook) {
		return <LoadingPage />;
	}

	const { data: posts } = api.books.getBookPostsByGoogleId.useQuery({
		googleId: book.googleId,
	});

	const userHasReviewed =
		user && posts
			? posts?.map((post) => post.poster.id).includes(user?.id)
			: false;

	const {
		data: recs,
		error: recsError,
		isLoading: isLoadingRecs,
	} = api.googleApi.getRecommendations.useQuery(
		{
			book: `${book.title} by ${book.authors[0].name}`,
		},
		{ retry: false },
	);

	return (
		<PageLayout>
			<div className="flex flex-col items-center py-4 px-24">
				<div className="flex flex-col p-4 gap-4 w-full">
					<div className="flex gap-2">
						<div className="h-auto">
							<Image
								src={book.imageUrl || DEFAULT_IMG_URL}
								alt={book.title}
								width={150}
								height={0}
								style={{ height: "auto" }}
							/>
						</div>
						<div className="flex flex-col">
							<Link href={`/books/${book.googleId}`}>
								<h2 className="text-black/80 text-3xl">{book.title}</h2>
								<p className="text-black/80 text-xl">{book.subtitle}</p>
							</Link>
							{book.authors.map((author) => (
								<Link key={author.id} href={`/authors/${author.name}`}>
									<p className="text-slate-700 font-bold">{author.name}</p>
								</Link>
							))}
							<div className="mt-auto">
								<RatingSummary
									posts={
										posts?.map((post) => {
											const { poster, ...rest } = post;
											return rest;
										}) || []
									}
								/>
							</div>
						</div>
					</div>
					<hr />
					<div>
						<p className="text-md text-black/90">{book.description}</p>
					</div>
					{isSignedIn && !userHasReviewed ? (
						<>
							<hr />
							<AddPost book={book} />
						</>
					) : (
						!isSignedIn && (
							<div>
								<Link href="/signin" className="font-semibold text-slate-800">
									Sign in
								</Link>{" "}
								to create a post
							</div>
						)
					)}
					<hr />
					{isLoadingRecs && <LoadSpinner size={24} />}
					{recs && (
						<div>
							<h2 className="font-semibold text-lg">You might also like</h2>
							<HorizontalScroller>
								{recs.map((book) => (
									<BookItem book={book} key={book.googleId} />
								))}
							</HorizontalScroller>
						</div>
					)}
					{recsError && (
						<h2>Error getting recommendations. Please try again later.</h2>
					)}
					<hr />
					<div>
						{posts?.length ? (
							<h2 className="font-semibold text-lg">User Reviews</h2>
						) : (
							<h2 className="font-semibold text-lg">No Reviews Yet</h2>
						)}
						{posts
							?.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
							.map((post) => (
								<div className="flex flex-col items-center" key={post.id}>
									<PostItem post={post} />
									<div className="border-b w-4/5" />
								</div>
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
