const UserHero = ({ username }: { username: string }) => {
	return (
		<div className="bg-green-300 w-full">
			<div className="px-32 py-24">
				<p className="text-3xl">Welcome {username}</p>
			</div>
		</div>
	);
};

export default UserHero;
