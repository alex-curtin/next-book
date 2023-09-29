import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/router";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import SearchIcon from "./ui/icons/search-icon";
import PageLayout from "./layout";
import PageHeader from "./ui/page-header";

const SearchLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchTerm) {
			router.push(`/search?q=${searchTerm}`);
		}
	};

	return (
		<PageLayout>
			<div className="flex min-h-screen flex-col items-center justify-start p-8 gap-4">
				<PageHeader title="Search for books" />
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
				{children}
			</div>
		</PageLayout>
	);
};

export default SearchLayout;
