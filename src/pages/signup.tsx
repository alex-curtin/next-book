import { SignUp } from "@clerk/nextjs";

const SignupPage = () => {
	return <SignUp signInUrl="/signin" />;
};

export default SignupPage;
