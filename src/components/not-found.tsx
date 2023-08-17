import PageLayout from "./layout";

const NotFound = ({ message = "Page not found" }: { message: string }) => {
	return (
		<PageLayout>
			<div className="flex flex-col items-center w-full justify-center p-8">
				<h2 className="text-xl font-bold">404</h2>
				<p>{message}</p>
			</div>
		</PageLayout>
	);
};

export default NotFound;
