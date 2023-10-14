import { PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
	return (
		<div className="h-screen">
			<main className="flex flex-col items-center pt-16 w-full 2xl:max-w-[1536px] 2xl:mx-auto">
				<div className="w-full">{props.children}</div>
			</main>
		</div>
	);
};

export default PageLayout;
