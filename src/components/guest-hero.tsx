import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";

import { Button } from "./ui/button";
import toast from "react-hot-toast";

const GuestHero = () => {
	const { isLoaded, signIn, setActive } = useSignIn();

	const guestSignIn = async () => {
		if (!isLoaded) return;

		try {
			const { status, createdSessionId } = await signIn.create({
				identifier: "guest",
				password: process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD,
			});

			if (status === "complete") {
				setActive({ session: createdSessionId });
			} else {
				toast("Error logging in as guest");
			}
		} catch (error) {
			toast("Error logging in as guest");
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
				<div className="w-fit text-center">
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
								className="bg-yellow-300 hover:bg-yellow-400 text-lg font-bold text-black"
								onClick={() => guestSignIn()}
							>
								Use Guest Account
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
