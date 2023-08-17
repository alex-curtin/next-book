import { useState } from "react";
import { useRouter } from "next/router";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import SearchIcon from "./ui/icons/search-icon";
import PageLayout from "./layout";

const SearchLayout = ({ children }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		if (searchTerm) {
			router.push(`/search/${searchTerm}`);
		}
	};

	return (
		<PageLayout>
			<div className="flex min-h-screen flex-col items-center justify-start p-8 gap-4">
				<form className="flex items-center gap-1" onSubmit={onSubmit}>
					<Input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-black/10"
						placeholder="Search for books"
					/>
					<Button type="submit">
						<SearchIcon />
					</Button>
				</form>
				{/* <div className="flex flex-col gap-4">
							{data?.map((book) => (
								<Link
									key={book.googleId}
									className="flex gap-1 pr-2 py-1 hover:bg-black/10 transition"
									href={`/books/${book.googleId}`}
								>
									<BookItem book={book} />
								</Link>
							))}
						</div> */}
				{children}
			</div>
		</PageLayout>
	);
};

export default SearchLayout;
