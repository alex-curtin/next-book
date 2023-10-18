import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { DEFAULT_IMG_URL } from "~/constants";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import StarIcon from "./ui/icons/star-icon";
import { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type Book = RouterOutputs["posts"]["getUserFeed"]["feed"][number]["book"];
type Post = RouterOutputs["posts"]["getUserFeed"]["feed"][number]["post"];

const PostFeedItem = ({
	book,
	post,
	showUserInfo = true,
}: { book: Book; post: Post; showUserInfo?: boolean }) => {
	return (
		<div key={post.id} className="flex gap-4 pb-4 mb-4 border-b">
			<Link href={`/books/${book.googleId}`}>
				<div className="h-auto w-[125px]">
					<Image
						src={book.imageUrl || DEFAULT_IMG_URL}
						alt={book.title}
						width={125}
						height={0}
						style={{ height: "auto" }}
					/>
				</div>
			</Link>
			<div className="w-full">
				{showUserInfo && (
					<div className="flex gap-1 items-center pb-1">
						<Avatar className="w-8 h-8">
							<AvatarImage
								src={post.poster?.imageUrl}
								alt={post.poster?.username}
							/>
							<AvatarFallback>{post.poster?.username[0]}</AvatarFallback>
						</Avatar>
						<Link
							href={`/users/${post.posterId}`}
							className="font-semibold text-black/90"
						>
							@{post.poster?.username}
						</Link>{" "}
					</div>
				)}
				<Link href={`/posts/${post.id}`}>
					<p className="font-bold text-black/80 text-xl">{book.title}</p>
				</Link>
				<p className="text-black/80">{book.subtitle}</p>
				{book.authors.map((author) => (
					<Link key={author.id} href={`/authors/${author.name}`}>
						<p className="text-slate-800 font-semibold">{author.name}</p>
					</Link>
				))}
				<div className="flex items-center mt-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<StarIcon filled={i < post.rating} key={`star-${i}`} />
					))}
					<p className="text-black/80 text-xs ml-2">
						{dayjs(post.createdAt).fromNow()}
					</p>
				</div>
				<div className="mt-6">
					<p className="text-black/90">{post.content}</p>
				</div>
			</div>
		</div>
	);
};

export default PostFeedItem;
