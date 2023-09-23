import { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";

import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api, RouterOutputs } from "~/utils/api";

import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import StarIcon from "~/components/ui/icons/star-icon";
import EditIcon from "~/components/ui/icons/edit-icon";
import PageLayout from "~/components/layout";
import NotFound from "~/components/not-found";
import BookItem from "~/components/book-item";
import PostItem from "~/components/post-item";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"][number]["post"];

const EditPost = ({
	post,
	cancel,
}: { post: PostWithPoster; cancel: () => void }) => {
	const ctx = api.useContext();
	const router = useRouter();
	const [postContent, setPostContent] = useState(post.content);
	const [rating, setRating] = useState(post.rating);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const { mutate: update } = api.posts.edit.useMutation({
		onSuccess: (post) => {
			console.log(post);
			ctx.posts.getById.invalidate();
			cancel();
		},
	});

	const { mutate: deletePost } = api.posts.delete.useMutation({
		onSuccess: () => {
			router.push(`/users/${post.posterId}`);
			toast("Post deleted");
		},
	});

	const onClickSave = () => {
		if (postContent === post.content && rating === post.rating) {
			cancel();
		} else {
			update({
				id: post.id,
				content: postContent,
				rating,
			});
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full relative">
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
				className="w-full"
			/>
			<div className="flex justify-end gap-2">
				<Button onClick={onClickSave}>Save</Button>
				<Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
					Delete
				</Button>
				<Button variant="secondary" onClick={cancel}>
					Cancel
				</Button>
			</div>
			{deleteModalOpen && (
				<div className="fixed bg-black/50 top-0 left-0 w-full h-full flex items-center justify-center">
					<div className="bg-white p-8 rounded-sm">
						<p className="text-xl">Delete this post?</p>
						<p className="text-black/90">This action cannot be undone.</p>
						<div className="flex gap-2 justify-center mt-8">
							<Button
								variant="destructive"
								onClick={() => deletePost({ id: post.id })}
							>
								Confirm
							</Button>
							<Button
								variant="secondary"
								onClick={() => setDeleteModalOpen(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const SinglePostPage = ({ id }: { id: string }) => {
	const { user } = useUser();
	const [isEditing, setIsEditing] = useState(false);
	const { data: postData } = api.posts.getById.useQuery({ id });

	if (!postData) return <NotFound message="Post not found" />;

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				<div className="flex flex-col gap-2">
					<div>
						<BookItem key={postData.book.id} book={postData.book} />
						{isEditing ? (
							<EditPost
								post={postData.post}
								cancel={() => setIsEditing(false)}
							/>
						) : (
							<div className="relative">
								{user && user.id === postData.post.posterId && (
									<button
										type="button"
										className="absolute top-6 right-0"
										onClick={() => setIsEditing(true)}
									>
										<EditIcon />
									</button>
								)}
								<PostItem key={postData.post.id} post={postData.post} />
							</div>
						)}
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
