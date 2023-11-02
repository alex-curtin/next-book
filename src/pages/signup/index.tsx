import { SignUp } from "@clerk/nextjs";

import PageLayout from "~/components/layout";

const SignupPage = () => {
	return (
		<PageLayout>
			<div className="flex justify-center">
				<SignUp signInUrl="/signin" path="/signup" routing="path" />
			</div>
		</PageLayout>
	);
};

export default SignupPage;
