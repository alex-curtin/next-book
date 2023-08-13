import { SignUp } from "@clerk/nextjs";

import PageLayout from "~/components/layout";

const SignupPage = () => {
	return (
		<PageLayout>
			<SignUp signInUrl="/signin" />
		</PageLayout>
	);
};

export default SignupPage;
