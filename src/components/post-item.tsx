import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StarIcon from "./ui/icons/star-icon";
import { RouterOutputs } from "~/utils/api";
import { truncateString } from "~/utils/truncateString";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"][number]["post"];

const PostItem = ({ post }: { post: PostWithPoster }) => {
	const router = useRouter();
	const isPostPage = router.pathname === "/posts/[id]";
	const [isExpanded, setIsExpanded] = useState(isPostPage);
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
						isExpanded ? "" : "max-h-[136px]"
					} bg-neutral-200 w-full min-w-[500px] px-4 py-2 min-h-[96px] rounded-sm overflow-hidden relative`}
				>
					<Link href={`/posts/${post.id}`}>
						<p className="text-ellipsis text-sm">{post.content}</p>
					</Link>
					{!isExpanded ? (
						<div className="absolute bottom-0 right-0 w-full text-end bg-gradient-to-t from-neutral-200 via-50% via-neutral-200 to-transparent">
							<button
								type="button"
								className="text-black/80 w-full px-4 pt-4 py-1 h-12 flex items-end justify-end"
								onClick={() => setIsExpanded(true)}
							>
								see more
							</button>
						</div>
					) : (
						<div className="w-full text-end">
							<button
								type="button"
								className="text-black/80 w-full px-4 py-1 flex items-end justify-end"
								onClick={() => setIsExpanded(false)}
							>
								see less
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostItem;
