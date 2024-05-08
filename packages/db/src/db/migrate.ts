import "dotenv/config";
import { resolve } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });

(async () => {
	await migrate(db, { migrationsFolder: resolve(__dirname, "../../drizzle") });
})();
