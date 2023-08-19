ALTER TABLE "follows" RENAME COLUMN "follower" TO "follower_id";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "followed" TO "followed_id";--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followed_follower";--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_id_follower_id" PRIMARY KEY("followed_id","follower_id");