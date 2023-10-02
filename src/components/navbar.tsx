import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

import BookIcon from "./ui/icons/book-icon";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import ProfileIcon from "./ui/icons/profile-icon";
import SignOutIcon from "./ui/icons/signout-icon";
import { Button } from "./ui/button";

const NavBar = () => {
	const { user } = useUser();

	return (
		<nav className="w-full z-50 flex justify-between items-center px-8 py-2 bg-green-300 fixed">
			<Link href="/" className="flex items-center gap-2">
				<BookIcon />
				<h1 className="text-lg font-bold text-black/80">NextBook</h1>
			</Link>
			<div className="flex gap-8 items-center">
				{user && <Link href={`/users/${user.id}`}>My Posts</Link>}
				<Link href="/posts">Recent Posts</Link>
				<Link href="/books">Popular Books</Link>
				<Link href="/search">Search Books</Link>
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage src={user.imageUrl} />
								<AvatarFallback>
									{user.username ? user.username[0].toUpperCase() : ""}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Link href="/profile" className="flex gap-1 items-center">
									<ProfileIcon />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<SignOutButton>
									<button type="button" className="flex gap-1 items-center">
										<SignOutIcon />
										<span>Sign Out</span>
									</button>
								</SignOutButton>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button variant="outline">
						<Link href="/signin">Sign In</Link>
					</Button>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
