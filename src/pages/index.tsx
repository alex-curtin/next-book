import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Image from "next/image";

import { searchBooks, type Book } from "~/lib/books-api";

const Home = () => {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	const { data, refetch } = useQuery(
		["books", debouncedSearchTerm],
		() => searchBooks(searchTerm),
		{
			// enabled: !!debouncedSearchTerm,
			enabled: false,
		},
	);
	// useEffect(() => {
	// 	const search = setTimeout(async () => {
	// 		setDebouncedSearchTerm(searchTerm);
	// 	}, 1000);

	// 	return () => clearTimeout(search);
	// }, [searchTerm]);

	const onClick = () => {
		if (searchTerm) {
			refetch();
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 ">
			Home
			<form>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="bg-black/10"
				/>
				<button type="button" onClick={onClick}>
					search
				</button>
			</form>
			<div className="flex flex-col gap-2">
				{data?.map((book) => (
					<div key={book.googleId} className="flex gap-1">
						<Image
							src={
								book.imgUrl ||
								"https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
							}
							height={128}
							width={128}
							alt={book.title}
						/>
						<div className="p-2">
							<p>{book.title}</p>
							<p className="text-sm text-black/80">{book.authors[0]}</p>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Home;
