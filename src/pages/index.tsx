import { useUser } from "@clerk/nextjs";

import GuestDash from "~/components/guest-dash";
import PageLayout from "~/components/layout";
import PageHeader from "~/components/ui/page-header";
import UserDash from "~/components/user-dash";
import GuestHero from "~/components/guest-hero";
import { api, RouterOutputs } from "~/utils/api";
import BookItem from "~/components/book-item";
import HorizontalScroller from "~/components/ui/horizontal-scroller";
import RatingSummary from "~/components/rating-summary";
import Link from "next/link";

type Category = RouterOutputs["categories"]["getPrimary"][number];

const CategorySection = ({ category }: { category: Category }) => {
	return (
		<section className="w-full">
			<div className="flex justify-between items-center px-8 mb-2">
				<h2 className="text-lg font-bold uppercase">{category.name}</h2>
				<Link
					href={`/categories/${category.id}`}
					className="text-sm text-blue-800"
				>
					see more
				</Link>
			</div>
			<HorizontalScroller>
				{category.books.map((book) => (
					<div key={book.id} className="max-w-[250px]">
						<BookItem book={book} />
						<RatingSummary posts={book.posts} />
					</div>
				))}
			</HorizontalScroller>
		</section>
	);
};

const Home = () => {
	const { isSignedIn, user } = useUser();
	const { data, isLoading } = api.categories.getPrimary.useQuery();

	return (
		<PageLayout banner={isSignedIn ? null : <GuestHero />}>
			<div className="flex flex-col items-center px-8">
				<div className="w-full px-4 flex flex-col gap-6">
					{data?.map((cat) => (
						<CategorySection key={cat.id} category={cat} />
					))}
				</div>
				{/* <PageHeader title={`Welcome ${user?.username || "Guest"}!`} /> */}
				{/* {isSignedIn ? <UserDash /> : <GuestDash />} */}
			</div>
		</PageLayout>
	);
};

export default Home;
