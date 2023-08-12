import { SignIn } from "@clerk/nextjs";

const SigninPage = () => {
	return <SignIn signUpUrl="/signup" />;
};

export default SigninPage;
