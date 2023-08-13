import { PropsWithChildren, use } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import BookIcon from "./ui/icons/book-icon";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const NavBar = () => {
	const { user } = useUser();

	return (
		<nav className="w-full flex justify-between items-center px-4 py-2 bg-orange-300">
			<Link href="/">
				<BookIcon />
			</Link>
			<div className="flex gap-8 items-center">
				<Link href="/search-books">Search Books</Link>
				{user && (
					<Avatar>
						<AvatarImage src={user.imageUrl} />
						<AvatarFallback>
							{user.firstName[0] + user.lastName[0] || ""}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
		</nav>
	);
};

const PageLayout = (props: PropsWithChildren) => {
	return (
		<main className="flex flex-col items-center min-h-screen">
			<NavBar />
			<div className="w-full">{props.children}</div>
		</main>
	);
};

export default PageLayout;
