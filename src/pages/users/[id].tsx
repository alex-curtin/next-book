import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { GetServerSideProps } from "next";
import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import PageLayout from "~/components/layout";
import PostItem from "~/components/post-item";
import BookItem from "~/components/book-item";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { LoadSpinner } from "~/components/loading";
import NotFound from "~/components/not-found";

const FollowButton = ({
	following,
	followedId,
}: { following: boolean; followedId: string }) => {
	const ctx = api.useContext();
	const { mutate: follow, isLoading: isFollowing } =
		api.follows.follow.useMutation({
			onSuccess: () => {
				ctx.users.getById.invalidate();
			},
		});
	const { mutate: unfollow, isLoading: isUnfollowing } =
		api.follows.unfollow.useMutation({
			onSuccess: () => {
				ctx.users.getById.invalidate();
			},
		});

	const onClickFollow = () => {
		follow({ followedId: followedId });
	};

	const onClickUnfollow = () => {
		unfollow({ followedId: followedId });
	};

	if (!following) {
		return (
			<Button onClick={onClickFollow} variant="outline" disabled={isFollowing}>
				{isFollowing ? <LoadSpinner /> : "Follow"}
			</Button>
		);
	}

	return (
		<Button
			onClick={onClickUnfollow}
			variant="outline"
			disabled={isUnfollowing}
		>
			{isUnfollowing ? <LoadSpinner /> : "Unfollow"}
		</Button>
	);
};

const SingleUserPage = ({ id }: { id: string }) => {
	const { data: postsData, isLoading: isLoadingPosts } =
		api.posts.getAllByUser.useQuery({
			id,
		});

	const { data: user, isLoading: isLoadingUser } = api.users.getById.useQuery({
		id,
	});

	if (!user) return <NotFound message="User not found" />;

	const { user: currentUser } = useUser();

	return (
		<PageLayout>
			<div className="flex flex-col items-center p-4 max-w-2xl mx-auto">
				{!isLoadingUser && user && (
					<div className="flex flex-col items-center gap-4 mb-8">
						<div className="flex gap-2">
							<Avatar className="w-24 h-24">
								<AvatarImage src={user.imageUrl} alt={user.username} />
								<AvatarFallback>
									{user.username[0].toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="font-bold text-lg">{user.username}</h2>
								<div className="text-sm text-black/80">
									<p>joined {dayjs(user.createdAt).format("MMM DD, YYYY")}</p>
									<p>
										{postsData?.length || 0} post
										{postsData?.length === 1 ? "" : "s"}
									</p>
									<p>
										{user.followers.length} follower
										{user.followers.length === 1 ? "" : "s"} ·{" "}
										{user.following.length} following
									</p>
								</div>
							</div>
						</div>
						{currentUser && currentUser.id !== user.id && (
							<FollowButton
								following={user.followers.includes(currentUser.id)}
								followedId={user.id}
							/>
						)}
					</div>
				)}
				{isLoadingPosts && <div>loading...</div>}
				{postsData?.length ? (
					<div className="flex flex-col gap-2">
						{postsData.map(({ post, book }) => (
							<div key={post.id}>
								<BookItem book={book} />
								<PostItem post={post} />
							</div>
						))}
					</div>
				) : (
					<p>This user has not made any posts yet</p>
				)}
			</div>
		</PageLayout>
	);
};

export default SingleUserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const id = context.params?.id;

	if (typeof id !== "string") {
		throw new Error("Missing id");
	}

	await ssHelper.users.getById.prefetch({ id });
	await ssHelper.posts.getAllByUser.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
