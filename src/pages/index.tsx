import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

import PageLayout from "~/components/layout";
import { LoadSpinner } from "~/components/loading";

const Home = () => {
	const router = useRouter();
	const { isSignedIn } = useUser();

	if (isSignedIn) {
		router.push("/feed");
	} else {
		router.push("/posts");
	}

	return (
		<PageLayout>
			<LoadSpinner />
		</PageLayout>
	);
};

export default Home;
