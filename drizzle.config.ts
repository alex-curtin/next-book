import { Config } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DRIZZLE_DATABASE_URL) {
	throw new Error("DRIZZLE_DATABASE_URL is missing");
}

export default {
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DRIZZLE_DATABASE_URL,
	},
} satisfies Config;
