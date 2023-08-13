import { SignIn } from "@clerk/nextjs";

import PageLayout from "~/components/layout";

const SigninPage = () => {
	return (
		<PageLayout>
			<SignIn signUpUrl="/signup" />
		</PageLayout>
	);
};

export default SigninPage;
