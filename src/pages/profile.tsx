import { UserProfile } from "@clerk/nextjs";
import PageLayout from "~/components/layout";

const UserProfilePage = () => {
	return (
		<PageLayout>
			<div className="w-full flex justify-center">
				<UserProfile />
			</div>
		</PageLayout>
	);
};

export default UserProfilePage;
