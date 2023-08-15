import { PropsWithChildren, use } from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

import BookIcon from "./ui/icons/book-icon";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "./ui/dropdown-menu";

const NavBar = () => {
	const { user } = useUser();

	return (
		<nav className="w-full flex justify-between items-center px-8 py-2 bg-orange-300 fixed">
			<Link href="/">
				<BookIcon />
			</Link>
			<div className="flex gap-8 items-center">
				<Link href="/search-books">Search Books</Link>
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage src={user.imageUrl} />
								<AvatarFallback>
									{user.username[0].toUpperCase() || ""}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent sideOffset={10}>
							<DropdownMenuItem>
								<SignOutButton />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link href="/signin">Sign In</Link>
				)}
			</div>
		</nav>
	);
};

const PageLayout = (props: PropsWithChildren) => {
	return (
		<div className="h-screen overflow-y-auto">
			<NavBar />
			<main className="flex flex-col items-center pt-16">
				<div className="w-full">{props.children}</div>
			</main>
		</div>
	);
};

export default PageLayout;
