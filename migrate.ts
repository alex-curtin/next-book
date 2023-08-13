import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "~/server/db/db";

const main = async () => {
	try {
		await migrate(db, { migrationsFolder: "drizzle" });
		console.log("migration complete");
	} catch (error) {
		console.error("error migrating db", error);
	}
};

main();
