import { useUser } from "@clerk/nextjs";
import GuestDash from "~/components/guest-dash";

import PageLayout from "~/components/layout";
import PageHeader from "~/components/ui/page-header";
import UserFeed from "~/components/user-feed";

const Home = () => {
	const { isSignedIn, user } = useUser();

	return (
		<PageLayout>
			<div className="flex flex-col items-center">
				<PageHeader title={`Welcome ${user?.username || "Guest"}!`} />
				{isSignedIn ? <UserFeed /> : <GuestDash />}
			</div>
		</PageLayout>
	);
};

export default Home;
