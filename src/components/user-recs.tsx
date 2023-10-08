import { api } from "~/utils/api";
import BookItem from "./book-item";
import { LoadSpinner } from "./loading";

const UserRecs = () => {
	const {
		data: recommendations,
		isLoading,
		error,
	} = api.googleApi.getUserRecommendations.useQuery(undefined, {
		retry: false,
	});

	return (
		<div>
			<h3 className="font-semibold mb-2">Recommended for you</h3>
			{isLoading && <LoadSpinner />}
			{recommendations?.length && (
				<>
					<div className="flex flex-col gap-4 mb-4">
						{recommendations.map((book) => (
							<div key={book.googleId}>
								<BookItem book={book} />
							</div>
						))}
					</div>
				</>
			)}
			{error && <h3>Error getting recommendations. Please try again later.</h3>}
		</div>
	);
};

export default UserRecs;
