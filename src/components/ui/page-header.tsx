const PageHeader = ({ title }: { title: string }) => {
	return (
		<h1 className="font-bold text-2xl capitalize text-black/90">{title}</h1>
	);
};

export default PageHeader;
