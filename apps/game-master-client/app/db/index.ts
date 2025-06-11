import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./schema/auth-schema";

const queryClient = postgres(process.env.DB_URL!);

export const db = drizzle(queryClient, {
	schema: authSchema,
});
