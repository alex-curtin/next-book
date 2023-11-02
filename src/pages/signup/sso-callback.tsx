import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

import PageLayout from "~/components/layout";

const SSOCallback = () => {
	return (
		<PageLayout>
			<AuthenticateWithRedirectCallback />
		</PageLayout>
	);
};

export default SSOCallback;
