import "dotenv/config";
import { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schemas/*",
	out: "./drizzle",
	driver: "turso",
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
} satisfies Config;
