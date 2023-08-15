import Link from "next/link";
import Image from "next/image";
// import type { BookWithAuthors } from "~/server/db/schema";
import { RouterOutputs } from "~/utils/api";

type BookWithAuthors = RouterOutputs["posts"]["getAll"][number]["book"];

const BookItem = ({ book }: { book: BookWithAuthors }) => {
	return (
		<div className="flex gap-2">
			<Image src={book.imageUrl} alt={book.title} width={96} height={96} />
			<div className="flex flex-col gap-1">
				<p>{book.title}</p>
				<p>{book.subtitle}</p>
				{book.authors.map((author) => (
					<Link key={author.id} href={`/authors/${author.id}`}>
						<p className="text-black/80">{author.name}</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default BookItem;
