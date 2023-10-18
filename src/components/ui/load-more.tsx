import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "./button";

const LoadMore = ({
	action,
	children,
}: { action: () => void; children: ReactNode }) => {
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			action();
		}
	}, [inView]);

	return <div ref={ref}>{children}</div>;
};

export default LoadMore;
