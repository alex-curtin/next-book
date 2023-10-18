import { UserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

import PageLayout from "~/components/layout";
import { LoadingPage } from "~/components/loading";

const UserProfilePage = () => {
	const { user, isLoaded } = useUser();
	const router = useRouter();

	if (!isLoaded) {
		return <LoadingPage />;
	}

	if (!user || user.username === "guest") {
		router.push("/");
	}

	return (
		<PageLayout>
			<div className="w-full flex justify-center">
				{user?.username !== "guest" && <UserProfile />}
			</div>
		</PageLayout>
	);
};

export default UserProfilePage;
