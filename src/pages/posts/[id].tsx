import { GetServerSideProps } from "next";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clerkClient } from "@clerk/nextjs";

import { generateSSHelper } from "~/server/helpers/generateSSHelper";
import { api } from "~/utils/api";
import StarIcon from "~/components/ui/icons/star-icon";
import PageLayout from "~/components/layout";

dayjs.extend(relativeTime);

const SinglePostPage = ({ id }: { id: string }) => {
	const { data: post } = api.posts.getById.useQuery({ id });

	if (!post) return <div>404...can't find that post</div>;

	const { data: user } = api.users.getById.useQuery({ id: post.posterId });

	return (
		<PageLayout>
			<div className="flex flex-col items-center gap-4 p-4">
				<div className="flex gap-2">
					<Image
						src={post.book.imageUrl}
						alt={post.book.title}
						width={96}
						height={96}
					/>
					<div className="flex flex-col gap-1">
						<p>{post.book.title}</p>
						<p>{post.book.subtitle}</p>
						{post.book.bookAuthors.map((item) => (
							<p className="text-black/80" key={item.author.id}>
								{item.author.name}
							</p>
						))}
					</div>
				</div>
				<div className="w-1/3 flex flex-col gap-1">
					<p className="text-sm text-black/90">
						reviewed by: {user?.username} {dayjs(post.createdAt).fromNow()}
					</p>
					<div className="flex">
						{Array.from({ length: 5 }).map((_, i) => (
							// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<StarIcon filled={i < post.rating} key={i} />
						))}
					</div>
					<div className="bg-black/10 w-full px-4 py-2 min-h-[96px]">
						<p>{post.content}</p>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default SinglePostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssHelper = generateSSHelper();
	const { id } = context.params;

	await ssHelper.posts.getById.prefetch({ id });

	return {
		props: {
			id,
			trpcState: ssHelper.dehydrate(),
		},
	};
};
