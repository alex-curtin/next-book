import { PropsWithChildren, ReactNode } from "react";
import NavBar from "./navbar";

const PageLayout = ({
	children,
	banner = null,
}: { children: ReactNode; banner?: ReactNode }) => {
	return (
		<div className="h-screen">
			<NavBar />
			{banner}
			<main className="flex flex-col items-center py-20 w-full 2xl:max-w-[1536px] 2xl:mx-auto">
				<div className="w-full">{children}</div>
			</main>
		</div>
	);
};

export default PageLayout;
