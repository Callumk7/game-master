import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema/*",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DB_URL_STAGING!,
	},
} satisfies Config;
