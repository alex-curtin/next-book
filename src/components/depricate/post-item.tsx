import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import StarIcon from "~/components/ui/icons/star-icon";
import PageLayout from "~/components/layout";
import { RouterOutputs } from "~/utils/api";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

dayjs.extend(relativeTime);

type PostWithAllData = RouterOutputs["posts"]["getAll"][number];

const PostItem = ({ post }: { post: PostWithAllData }) => {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex gap-2">
				<Image
					src={post.book.imageUrl}
					alt={post.book.title}
					width={96}
					height={96}
				/>
				<div className="flex flex-col gap-1">
					<p>{post.book.title}</p>
					<p>{post.book.subtitle}</p>
					{post.book.bookAuthors.map((item) => (
						<Link key={item.author.id} href={`/authors/${item.author.id}`}>
							<p className="text-black/80">{item.author.name}</p>
						</Link>
					))}
				</div>
			</div>
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
