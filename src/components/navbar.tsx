import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { UserIcon, UserCircle, LogOut, LogIn, UserPlus } from "lucide-react";

import BookIcon from "./ui/icons/book-icon";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SearchIcon from "./ui/icons/search-icon";
import { api } from "~/utils/api";

const SearchBar = () => {
	const [term, setTerm] = useState("");
	const router = useRouter();

	const { data, refetch } = api.googleApi.previewSearch.useQuery(
		{ term },
		{
			enabled: !!term,
		},
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (term) {
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
		}
	};

	return (
		<div className="relative group">
			<form onSubmit={onSubmit} className="flex gap-1 relative">
				<Input
					type="text"
					onChange={(e) => setTerm(e.target.value)}
					className="md:group-focus-within:w-80 transition-all rounded-full"
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
				<div className="absolute top-12 left-0 bg-white shadow-lg rounded-sm hidden group-focus-within:block">
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

const NavBar = () => {
	const { user } = useUser();

	return (
		<nav className="w-full z-30 flex justify-between items-center px-8 py-4 bg-green-300 fixed">
			<Link href="/" className="flex items-center gap-2">
				<BookIcon />
				<h1 className="text-lg font-bold text-black/80">NextBook</h1>
			</Link>
			<div className="flex gap-8 items-center">
				<SearchBar />
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							{user ? (
								<>
									<AvatarImage src={user.imageUrl} />
									<AvatarFallback>
										{user.username ? user.username[0].toUpperCase() : ""}
									</AvatarFallback>
								</>
							) : (
								<>
									<AvatarImage src="" />
									<AvatarFallback>
										<UserIcon className="text-black/80" />
									</AvatarFallback>
								</>
							)}
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							{user ? (
								<Link href="/profile" className="flex gap-1 items-center">
									<UserCircle />
									<span>Profile</span>
								</Link>
							) : (
								<Link href="/signup" className="flex gap-1 items-center">
									<UserPlus />
									<span>Sign Up</span>
								</Link>
							)}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<SignOutButton>
								{user ? (
									<button type="button" className="flex gap-1 items-center">
										<LogOut />
										<span>Sign Out</span>
									</button>
								) : (
									<Link href="/signin" className="flex gap-1 items-center">
										<LogIn />
										<span>Sign In</span>
									</Link>
								)}
							</SignOutButton>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
};

export default NavBar;
