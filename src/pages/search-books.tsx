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
			<div className="flex min-h-screen flex-col items-center justify-start p-24 gap-4">
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
				<div className="flex flex-col gap-2">
					{data?.map((book) => (
						<Link
							key={book.googleId}
							className="flex gap-1"
							href={`/books/${book.googleId}`}
						>
							<Image
								src={book.imgUrl || DEFAULT_IMG_URL}
								height={128}
								width={128}
								alt={book.title}
							/>
							<div className="p-2">
								<p>{book.title}</p>
								<p className="text-sm text-black/80">{book.authors[0]}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</PageLayout>
	);
};

export default SearchBooksPage;
