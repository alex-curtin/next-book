import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { api } from "~/utils/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import SearchIcon from "./ui/icons/search-icon";

const SearchBar = ({
	expand = false,
	auto = false,
}: { expand?: boolean; auto?: boolean }) => {
	const [term, setTerm] = useState("");
	const router = useRouter();

	const { data, refetch } = api.googleApi.previewSearch.useQuery(
		{ term },
		{
			enabled: !!term && auto,
		},
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (term && auto) {
				refetch();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [term]);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (term) {
			router.push(`/search?q=${term}`);
		} else {
			router.push("/search");
		}
	};

	return (
		<div className="relative group">
			<form onSubmit={onSubmit} className="flex gap-1 relative">
				<Input
					type="text"
					onChange={(e) => setTerm(e.target.value)}
					className={`${
						expand ? "md:group-focus-within:w-80" : ""
					} transition-all rounded-full`}
					placeholder="search for books"
				/>
				<Button
					type="submit"
					variant="ghost"
					className="text-black/70 hover:bg-transparent absolute right-0 top-0"
				>
					<SearchIcon />
				</Button>
			</form>
			{data?.length && (
				<div className="absolute top-12 left-0 bg-white shadow-lg rounded-sm hidden group-focus-within:block w-full">
					{data.map((book) => (
						<Link
							key={book.googleId}
							className="border-b text-sm block"
							href={`/books/${book.googleId}`}
							onClick={() => setTerm("")}
						>
							<p className="hover:bg-neutral-100 p-1 text-black/90">
								{book.title} - {book.authors[0]?.name}
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
