import { PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
	return (
		<div className="h-screen">
			<main className="flex flex-col items-center pt-16">
				<div className="w-full">{props.children}</div>
			</main>
		</div>
	);
};

export default PageLayout;
