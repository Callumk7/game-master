import * as usersSchema from "./schema/users";
import * as gamesSchema from "./schema/games";
import * as notesSchema from "./schema/notes";
import "dotenv/config";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const queryClient = postgres(process.env.DB_URL!);
export const db = drizzle(queryClient, {
	schema: { ...usersSchema, ...gamesSchema, ...notesSchema },
});
