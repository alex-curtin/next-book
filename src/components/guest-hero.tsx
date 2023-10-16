import Link from "next/link";

import { Button } from "./ui/button";

const GuestHero = () => {
	return (
		<div className="bg-green-300 w-full lg:bg-[url('/hero-image.jpeg')] bg-contain">
			<div className="w-full p-32 flex flex-col gap-12 bg-gradient-to-r from-green-300 via-green-300 to-green-200/0">
				<div>
					<p className="text-3xl">Welcome bibliophile!</p>
					<p className="text-3xl">Discover new reading material.</p>
					<p className="text-3xl">Rate and review your favorite books.</p>
				</div>
				<div className="w-fit text-center">
					<Link href="/signup">
						<Button
							variant="secondary"
							size="lg"
							className="bg-yellow-300 hover:bg-yellow-400 text-lg font-bold"
						>
							Get Started - Create an Account
						</Button>
					</Link>
					<p className="mt-2 text-lg">
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
