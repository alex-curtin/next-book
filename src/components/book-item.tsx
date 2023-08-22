import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { RouterOutputs } from "~/utils/api";

type BookWithAuthors = RouterOutputs["posts"]["getAll"][number]["book"];

const truncateString = (str: string, maxLength = 500) =>
	str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;

const BookItem = ({ book }: { book: BookWithAuthors }) => {
	const router = useRouter();
	const description =
		router.pathname !== "/books/[id]"
			? truncateString(book.description || "")
			: book.description;

	return (
		<div className="flex gap-2">
			<Link href={`/books/${book.googleId}`}>
				<div className="w-[128px]">
					<Image
						src={book.imageUrl}
						alt={book.title}
						width={128}
						height={128}
					/>
				</div>
			</Link>
			<div className="flex flex-col">
				<Link href={`/books/${book.googleId}`}>
					<p className="font-bold text-black/80">{book.title}</p>
					<p>{book.subtitle}</p>
				</Link>
				{book.authors.map((author) =>
					author.id ? (
						<Link key={author.id} href={`/authors/${author.id}`}>
							<p className="text-black/90">{author.name}</p>
						</Link>
					) : (
						<p className="text-black/90">{author.name}</p>
					),
				)}
				{book.description && <p className="text-sm">{description}</p>}
			</div>
		</div>
	);
};

export default BookItem;
