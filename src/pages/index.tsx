import Link from "next/link";

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 ">
			Home
			<Link href="/search-books">Search for books</Link>
		</main>
	);
};

export default Home;
