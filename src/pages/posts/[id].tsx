import { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api, RouterOutputs } from "~/utils/api";

import { DEFAULT_IMG_URL } from "~/constants";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import StarIcon from "~/components/ui/icons/star-icon";
import EditIcon from "~/components/ui/icons/edit-icon";
import PageLayout from "~/components/layout";
import NotFound from "~/components/not-found";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"]["feed"][number]["post"];

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
			toast("Post updated");
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full relative pt-2">
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

	const userIsPoster = user?.id === postData.post.posterId;

	return (
		<PageLayout>
			<div className="flex flex-col items-center py-4 px-24">
				<div className="flex flex-col p-4 gap-4 w-full">
					<div className="flex gap-2">
						<div className="h-auto">
							<Image
								src={postData.book.imageUrl || DEFAULT_IMG_URL}
								alt={postData.book.title}
								width={150}
								height={0}
								style={{ height: "auto" }}
							/>
						</div>
						<div className="flex flex-col">
							<Link href={`/books/${postData.book.googleId}`}>
								<h2 className="text-black/80 text-3xl">
									{postData.book.title}
								</h2>
								<p className="text-black/80 text-xl">
									{postData.book.subtitle}
								</p>
							</Link>
							{postData.book.authors.map((author) => (
								<Link key={author.name} href={`/authors/${author.name}`}>
									<p className="text-slate-700 font-bold">{author.name}</p>
								</Link>
							))}
						</div>
					</div>
					<hr />
					<div className="flex flex-col gap-2 relative">
						<div className="flex gap-1 items-center pb-1">
							<Avatar className="w-10 h-10">
								<AvatarImage
									src={postData.post.poster?.imageUrl}
									alt={postData.post.poster?.username}
								/>
								<AvatarFallback>
									{postData.post.poster?.username[0]}
								</AvatarFallback>
							</Avatar>
							<Link
								href={`/users/${postData.post.posterId}`}
								className="font-semibold text-black/90 text-lg"
							>
								@{postData.post.poster?.username}
							</Link>{" "}
						</div>

						{isEditing ? (
							<EditPost
								post={postData.post}
								cancel={() => setIsEditing(false)}
							/>
						) : (
							<div className="relative flex flex-col gap-2">
								<div className="flex items-center">
									{Array.from({ length: 5 }).map((_, i) => (
										<StarIcon
											filled={i < postData.post.rating}
											key={`star-${i}`}
										/>
									))}
									<p className="text-black/80 text-xs ml-2">
										{dayjs(postData.post.createdAt).fromNow()}
									</p>
									{userIsPoster && (
										<div className="ml-auto">
											<Button
												onClick={() => setIsEditing(true)}
												variant="ghost"
												size="sm"
											>
												<EditIcon />
											</Button>
										</div>
									)}
								</div>
								<p className="text-black/80">{postData.post.content}</p>
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
