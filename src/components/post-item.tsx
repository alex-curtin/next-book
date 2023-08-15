import { type Post } from "~/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StarIcon from "./ui/icons/star-icon";
import { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"][number]["post"];

const PostItem = ({ post }: { post: PostWithPoster }) => {
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
				<div className="bg-black/10 w-full px-4 py-2 min-h-[96px]">
					<p>{post.content}</p>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
