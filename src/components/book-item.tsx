import Link from "next/link";
import Image from "next/image";

import { type Book } from "~/server/api/routers/google-api";
import { RouterOutputs } from "~/utils/api";
import { DEFAULT_IMG_URL } from "~/constants";

type BookWithAuthors = RouterOutputs["posts"]["getAll"]["feed"][number]["book"];

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
				<div className="h-auto w-[125px] hover:brightness-105">
					<Image
						src={book.imageUrl || DEFAULT_IMG_URL}
						alt={book.title}
						width={125}
						height={0}
						style={{ height: "auto" }}
					/>
				</div>
			</Link>
			<div className="flex flex-col min-w-[125px]">
				<Link href={`/books/${book.googleId}`}>
					<p className="font-bold text-black/80 text-lg leading-5 hover:opacity-80">
						{book.title}
					</p>
					<p className="text-black/80 text-sm">{book.subtitle}</p>
				</Link>
				{book.authors.map((author) => (
					<Link key={author.name} href={`/authors/${author.name}`}>
						<p className="text-slate-800 font-semibold text-sm hover:opacity-80">
							{author.name}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default BookItem;
