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
						<StarIcon filled={i < post.rating} key={`star-${i}`} />
					))}
				</div>

				<div className="w-full py-2 min-h-[96px]">
					<p className="text-ellipsis text-sm">{post.content}</p>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
