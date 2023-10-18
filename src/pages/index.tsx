import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import PageLayout from "~/components/layout";
import GuestHero from "~/components/guest-hero";
import { api, RouterOutputs } from "~/utils/api";
import BookItem from "~/components/book-item";
import HorizontalScroller from "~/components/ui/horizontal-scroller";
import RatingSummary from "~/components/rating-summary";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/components/ui/tabs";
import UserFeed from "~/components/user-feed";
import GuestFeed from "~/components/guest-feed";
import { LoadingPage } from "~/components/loading";

type Category = RouterOutputs["categories"]["getPrimary"][number];

const CategorySection = ({ category }: { category: Category }) => {
	return (
		<section className="w-full">
			<div className="flex justify-between items-center px-8 mb-2">
				<h2 className="text-lg font-bold capitalize">{category.name}</h2>
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
			<hr />
		</section>
	);
};

const RecommendationsSection = () => {
	const {
		data: recommendations,
		isLoading,
		isFetching,
		error,
	} = api.googleApi.getUserRecommendations.useQuery(undefined, {
		refetchOnWindowFocus: false,
	});

	if (error) {
		return (
			<div className="px-8">
				<p className="font-semibold text-lg">
					Error getting recommendations. Please try again later.
				</p>
			</div>
		);
	}

	return (
		<section className="w-full">
			<div className="flex justify-between items-center px-8 mb-2">
				<h2 className="text-lg font-bold capitalize">Recommended for you</h2>
			</div>
			<HorizontalScroller>
				{(isLoading || isFetching) && (
					<>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={`skeleton-${i}`} className="flex">
								<Skeleton className="w-[125px] h-[191px]" />
								<div className="flex flex-col gap-1 px-2">
									<Skeleton className="w-[120px] h-5" />
									<Skeleton className="w-[80px] h-5" />
									<Skeleton className="w-[100px] h-5" />
								</div>
							</div>
						))}
					</>
				)}
				{!isFetching &&
					recommendations?.map((book) => (
						<div key={book.googleId} className="max-w-[265px]">
							<BookItem book={book} />
						</div>
					))}
			</HorizontalScroller>
			<hr />
		</section>
	);
};

const Home = () => {
	const { isSignedIn, user, isLoaded } = useUser();
	const { data } = api.categories.getPrimary.useQuery();

	if (!isLoaded) {
		return <LoadingPage />;
	}

	return (
		<PageLayout banner={isSignedIn ? null : <GuestHero />}>
			<div className="flex flex-col items-center px-8 pt-4">
				<Tabs defaultValue="books" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="books" className="w-full">
							Books
						</TabsTrigger>
						<TabsTrigger value="posts" className="w-full">
							Posts
						</TabsTrigger>
					</TabsList>
					<TabsContent value="books">
						<div className="w-full px-4 flex flex-col gap-6">
							{isSignedIn && <RecommendationsSection />}
							{data?.map((cat) => (
								<CategorySection key={cat.id} category={cat} />
							))}
						</div>
					</TabsContent>
					<TabsContent value="posts">
						{isSignedIn ? <UserFeed /> : <GuestFeed />}
					</TabsContent>
				</Tabs>
			</div>
		</PageLayout>
	);
};

export default Home;
