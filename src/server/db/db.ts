import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const dbUrl = process.env.DRIZZLE_DATABASE_URL;

if (!dbUrl) {
	throw new Error("DRIZZLE_DATABASE_URL is missing");
}

const sql = neon(dbUrl);

export const db = drizzle(sql, { schema });
