import { SignIn } from "@clerk/nextjs";

import PageLayout from "~/components/layout";

const SigninPage = () => {
	return (
		<PageLayout>
			<div className="flex justify-center">
				<SignIn signUpUrl="/signup" path="/signin" />
			</div>
		</PageLayout>
	);
};

export default SigninPage;
