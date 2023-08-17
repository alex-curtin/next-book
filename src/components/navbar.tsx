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
				{user && <Link href={`/users/${user.id}`}>My Posts</Link>}
				<Link href="/search">Search Books</Link>
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

export default NavBar;
