import Link from "next/link";
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
import SearchBar from "./search-bar";

const NavBar = () => {
	const { user } = useUser();

	return (
		<nav className="w-full z-30 flex justify-between items-center px-8 py-4 bg-green-300 fixed">
			<Link href="/" className="flex items-center gap-2">
				<BookIcon />
				<h1 className="text-lg font-bold text-black/80">NextBook</h1>
			</Link>
			<div className="flex gap-8 items-center">
				<SearchBar expand={true} auto={true} />
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
