import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/components/ui/tabs";
import UserFeed from "./user-feed";
import UserRecs from "./user-recs";

const UserDash = () => {
	return (
		<div className="flex flex-col p-4 max-w-2xl mx-auto">
			<Tabs defaultValue="feed">
				<TabsList className="w-full">
					<TabsTrigger value="feed" className="w-full">
						Feed
					</TabsTrigger>
					<TabsTrigger value="recommendations" className="w-full">
						Recommendations
					</TabsTrigger>
				</TabsList>
				<TabsContent value="feed">
					<UserFeed />
				</TabsContent>
				<TabsContent value="recommendations">
					<UserRecs />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UserDash;
