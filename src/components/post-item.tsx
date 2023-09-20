import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StarIcon from "./ui/icons/star-icon";
import EditIcon from "./ui/icons/edit-icon";
import { RouterOutputs } from "~/utils/api";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { truncateString } from "~/utils/truncateString";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"][number]["post"];

const EditPost = ({
	post,
	cancel,
}: { post: PostWithPoster; cancel: () => void }) => {
	const [postContent, setPostContent] = useState(post.content);

	const onClickSave = () => {
		console.log(postContent);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
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
				<Button variant="destructive">Delete</Button>
				<Button variant="secondary" onClick={cancel}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

const PostItem = ({ post }: { post: PostWithPoster }) => {
	const router = useRouter();
	const isPostPage = router.pathname === "/posts/[id]";
	const content = isPostPage ? post.content : truncateString(post.content);

	return (
		<div className="flex flex-col gap-4 py-4">
			<div className="flex flex-col gap-1 w-full">
				<div className="flex gap-2">
					<Avatar>
						<AvatarImage
							src={post.poster?.imageUrl}
							alt={post.poster?.username}
						/>
						<AvatarFallback>{post.poster?.username[0]}</AvatarFallback>
					</Avatar>
					<div>
						<p>
							<Link href={`/users/${post.posterId}`}>
								@{post.poster?.username}
							</Link>{" "}
						</p>
						<p className="text-black/80 text-xs">
							{dayjs(post.createdAt).fromNow()}
						</p>
					</div>
				</div>
				<div className="flex">
					{Array.from({ length: 5 }).map((_, i) => (
						// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<StarIcon filled={i < post.rating} key={i} />
					))}
				</div>

				<div
					className={`${
						isPostPage ? "" : "max-h-[136px]"
					} bg-neutral-200 w-full px-4 py-2 min-h-[96px] rounded-sm overflow-hidden relative`}
				>
					<p className="text-ellipsis text-sm">{post.content}</p>
					{!isPostPage && (
						<div className="absolute bottom-0 right-0 w-full text-end bg-gradient-to-t from-neutral-200 via-50% via-neutral-200 to-transparent">
							<Link
								href={`/posts/${post.id}`}
								className="text-black/80 px-4 pt-4 py-1 h-12 flex items-end justify-end"
							>
								see full post
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostItem;
