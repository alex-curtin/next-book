import { useUser } from "@clerk/nextjs";

import GuestDash from "~/components/guest-dash";
import PageLayout from "~/components/layout";
import PageHeader from "~/components/ui/page-header";
import UserDash from "~/components/user-dash";
import GuestHero from "~/components/guest-hero";

const Home = () => {
	const { isSignedIn, user } = useUser();

	return (
		<PageLayout>
			<div className="flex flex-col items-center">
				{!isSignedIn && <GuestHero />}
				<PageHeader title={`Welcome ${user?.username || "Guest"}!`} />
				{isSignedIn ? <UserDash /> : <GuestDash />}
			</div>
		</PageLayout>
	);
};

export default Home;
