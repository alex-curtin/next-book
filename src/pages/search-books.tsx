import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Image from "next/image";
import Link from "next/link";

import { searchBooks, type Book } from "~/lib/books-api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import SearchIcon from "~/components/ui/icons/search-icon";
import { DEFAULT_IMG_URL } from "~/constants";
import { api } from "~/utils/api";
import PageLayout from "~/components/layout";
import BookItem from "~/components/book-item";

const SearchBooksPage = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const { data, refetch, isFetching } = api.googleApi.searchBooks.useQuery(
		{
			term: searchTerm,
		},
		{ enabled: false },
	);

	const onClick = () => {
		if (searchTerm) {
			refetch();
		}
	};

	return (
		<PageLayout>
			<div className="flex min-h-screen flex-col items-center justify-start p-8 gap-4">
				<div className="flex items-center gap-1">
					<Input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-black/10"
						placeholder="Search for books"
					/>
					<Button type="button" disabled={isFetching} onClick={onClick}>
						<SearchIcon />
					</Button>
				</div>
				<div className="flex flex-col gap-4">
					{data?.map((book) => (
						<Link
							key={book.googleId}
							className="flex gap-1 pr-2 py-1 hover:bg-black/10 transition"
							href={`/books/${book.googleId}`}
						>
							<BookItem book={book} />
						</Link>
					))}
				</div>
			</div>
		</PageLayout>
	);
};

export default SearchBooksPage;
