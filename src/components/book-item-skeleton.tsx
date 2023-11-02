import { Skeleton } from "./ui/skeleton";

const BookItemSkeleton = () => {
	return (
		<div className="flex">
			<Skeleton className="w-[125px] h-[191px]" />
			<div className="flex flex-col gap-1 px-2">
				<Skeleton className="w-[120px] h-5" />
				<Skeleton className="w-[80px] h-5" />
				<Skeleton className="w-[100px] h-5" />
			</div>
		</div>
	);
};

export default BookItemSkeleton;
