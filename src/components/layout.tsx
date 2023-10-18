import { PropsWithChildren, ReactNode } from "react";
import NavBar from "./navbar";

const PageLayout = ({
	children,
	banner = null,
}: { children: ReactNode; banner?: ReactNode }) => {
	return (
		<div className="h-screen">
			<NavBar />
			<div className="py-[72px]">
				{banner}
				<main className="flex flex-col items-center w-full 2xl:max-w-[1536px] 2xl:mx-auto">
					<div className="w-full">{children}</div>
				</main>
			</div>
		</div>
	);
};

export default PageLayout;
