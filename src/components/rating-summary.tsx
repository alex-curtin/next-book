import { RouterOutputs } from "~/utils/api";
import StarIcon from "./ui/icons/star-icon";

type Posts = RouterOutputs["books"]["getAll"][number]["posts"];

const RatingSummary = ({ posts }: { posts: Posts }) => {
	const reviewCount = posts.length;
	const avgRating = Math.ceil(
		posts.reduce((acc, cur) => acc + cur.rating, 0) / reviewCount,
	);
	return (
		<div className="flex gap-1 text-sm items-center">
			<div className="flex items-center">
				<span className="mr-1">Average rating:</span>
				{Array.from({ length: 5 }).map((_, i) => (
					// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<StarIcon key={i} filled={i < avgRating} />
				))}
			</div>
			<p>
				{posts.length} review{posts.length === 1 ? "" : "s"}
			</p>
		</div>
	);
};

export default RatingSummary;
