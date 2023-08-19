CREATE TABLE IF NOT EXISTS "follows" (
	"follower" varchar NOT NULL,
	"followed" varchar NOT NULL,
	CONSTRAINT follows_followed_follower PRIMARY KEY("followed","follower")
);
