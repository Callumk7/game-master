import * as usersSchema from "./schema/users";
import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(process.env.DB_URL!);
export const db = drizzle(queryClient, {
	schema: usersSchema,
});
