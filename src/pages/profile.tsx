import { UserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

import PageLayout from "~/components/layout";

const UserProfilePage = () => {
	const { user } = useUser();
	const router = useRouter();

	if (user?.username === "guest") {
		router.push("/");
	}

	return (
		<PageLayout>
			<div className="w-full flex justify-center">
				<UserProfile />
			</div>
		</PageLayout>
	);
};

export default UserProfilePage;
