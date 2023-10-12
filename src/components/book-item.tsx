import Link from "next/link";
import Image from "next/image";

import { type Book } from "~/server/api/routers/google-api";
import { RouterOutputs } from "~/utils/api";
import { DEFAULT_IMG_URL } from "~/constants";

type BookWithAuthors = RouterOutputs["posts"]["getAll"][number]["book"];

const truncateString = (str: string, maxLength = 500) =>
	str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;

const BookItem = ({
	book,
	showFullDescription = false,
}: { book: Book | BookWithAuthors; showFullDescription?: boolean }) => {
	const description = !showFullDescription
		? truncateString(book.description || "")
		: book.description;

	return (
		<div className="flex gap-2">
			<Link href={`/books/${book.googleId}`}>
				<div className="w-[128px] h-auto">
					<Image
						src={book.imageUrl || DEFAULT_IMG_URL}
						alt={book.title}
						width={128}
						height={0}
						style={{ height: "auto" }}
					/>
				</div>
			</Link>
			<div className="flex flex-col">
				<Link href={`/books/${book.googleId}`}>
					<p className="font-bold text-black/80">{book.title}</p>
					<p>{book.subtitle}</p>
				</Link>
				{book.authors.map((author) => (
					// author.id ? (
					// 	<Link key={author.id} href={`/authors/${author.id}`}>
					// 		<p className="text-black/90">{author.name}</p>
					// 	</Link>
					// ) : (
					// 	<p className="text-black/90" key={author.name}>
					// 		{author.name}
					// 	</p>
					// ),
					<Link key={author.name} href={`/authors/${author.name}`}>
						<p className="text-black/90">{author.name}</p>
					</Link>
				))}
				{book.description && <p className="text-sm">{description}</p>}
			</div>
		</div>
	);
};

export default BookItem;
