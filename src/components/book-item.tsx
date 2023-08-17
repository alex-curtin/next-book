import Link from "next/link";
import Image from "next/image";

import { RouterOutputs } from "~/utils/api";

type BookWithAuthors = RouterOutputs["posts"]["getAll"][number]["book"];

const BookItem = ({ book }: { book: BookWithAuthors }) => {
	return (
		<div className="flex gap-2">
			<Link href={`/books/${book.googleId}`}>
				<Image src={book.imageUrl} alt={book.title} width={96} height={96} />
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
			</div>
		</div>
	);
};

export default BookItem;
