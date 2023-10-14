import { ReactNode, useRef } from "react";

import RightArrow from "./icons/right-arrow";
import LeftArrow from "./icons/left-arrow";

const HorizontalScroller = ({ children }: { children: ReactNode }) => {
	const scrollArea = useRef<HTMLDivElement>(null);

	const scroll = (amt: number) => {
		if (scrollArea.current) {
			scrollArea.current.scrollLeft += amt;
		}
	};

	return (
		<div className="flex">
			<button type="button" onClick={() => scroll(-250)} className="opacity-70">
				<LeftArrow />
			</button>
			<div
				className="flex flex-no-wrap overflow-x-scroll no-scrollbar scroll-smooth gap-4 py-2"
				ref={scrollArea}
			>
				{children}
			</div>
			<button type="button" onClick={() => scroll(250)} className="opacity-70">
				<RightArrow />
			</button>
		</div>
	);
};

export default HorizontalScroller;
