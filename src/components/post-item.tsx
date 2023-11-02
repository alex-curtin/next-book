import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StarIcon from "./ui/icons/star-icon";
import { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithPoster = RouterOutputs["posts"]["getAll"]["feed"][number]["post"];

const PostItem = ({ post }: { post: PostWithPoster }) => {
	return (
		<div className="flex flex-col gap-4 py-4 w-full">
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
							<Link
								href={`/users/${post.posterId}`}
								className="hover:opacity-80"
							>
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
					<Link href={`/posts/${post.id}`}>
						<p className="text-ellipsis text-sm">{post.content}</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
