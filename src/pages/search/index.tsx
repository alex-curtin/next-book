import PageLayout from "~/components/layout";
import SearchLayout from "~/components/search-layout";

const SearchPage = () => {
	return <></>;
};

export default SearchPage;

SearchPage.getLayout = function getLayout(page) {
	return <SearchLayout>{page}</SearchLayout>;
};
