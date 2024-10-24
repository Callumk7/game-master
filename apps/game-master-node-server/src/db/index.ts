import * as usersSchema from "./schema/users";
import * as gamesSchema from "./schema/games";
import * as notesSchema from "./schema/notes";
import * as charactersSchema from "./schema/characters";
import * as factionsSchema from "./schema/factions";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/lib/env";

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, {
	schema: {
		...usersSchema,
		...gamesSchema,
		...notesSchema,
		...charactersSchema,
		...factionsSchema,
	},
});
