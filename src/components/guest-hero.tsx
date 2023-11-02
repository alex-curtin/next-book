import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { LoadSpinner } from "./loading";
import { Button } from "./ui/button";

const GuestHero = () => {
	const { isLoaded, signIn, setActive } = useSignIn();
	const [isSigningIn, setIsSigningIn] = useState(false);

	const guestSignIn = async () => {
		if (!isLoaded) return;

		setIsSigningIn(true);

		try {
			const { status, createdSessionId } = await signIn.create({
				identifier: "guest",
				password: process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD,
			});

			if (status === "complete") {
				setActive({ session: createdSessionId });
			} else {
				toast("Error logging in as guest");
				setIsSigningIn(false);
			}
		} catch (error) {
			toast("Error logging in as guest");
			setIsSigningIn(false);
		}
	};

	return (
		<div className="bg-green-300 w-full lg:bg-[url('/hero-image.jpeg')] bg-contain">
			<div className="w-full p-28 flex flex-col gap-12 bg-gradient-to-r from-green-300 via-green-300 to-green-200/0">
				<div>
					<p className="text-3xl">Welcome bibliophile!</p>
					<p className="text-3xl">Discover new reading material.</p>
					<p className="text-3xl">Rate and review your favorite books.</p>
				</div>
				<div>
					<div className="flex flex-col md:flex-row items-center gap-4">
						<Link href="/signup">
							<Button
								variant="secondary"
								size="lg"
								className="bg-yellow-300 hover:bg-yellow-400 text-lg font-bold"
							>
								Create an Account
							</Button>
						</Link>
						<div className="">
							<Button
								size="lg"
								className="bg-yellow-300 hover:bg-yellow-400 text-lg font-bold text-black relative"
								onClick={() => guestSignIn()}
								disabled={isSigningIn}
							>
								<span className={`${isSigningIn ? "invisible" : ""}`}>
									Use Guest Account
								</span>
								{isSigningIn && (
									<span className="absolute top-0 w-full h-full flex items-center justify-center">
										<LoadSpinner size={24} />
									</span>
								)}
							</Button>
						</div>
					</div>
					<p className="mt-4 text-lg">
						Already have an account?{" "}
						<Link href="/signin" className="font-semibold text-slate-800">
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default GuestHero;
