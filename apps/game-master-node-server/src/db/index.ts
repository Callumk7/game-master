import * as authSchema from "./schema/auth";
import * as charactersSchema from "./schema/characters";
import * as factionsSchema from "./schema/factions";
import * as gamesSchema from "./schema/games";
import * as imagesSchema from "./schema/images";
import * as notesSchema from "./schema/notes";
import * as usersSchema from "./schema/users";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/lib/env";

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, {
	schema: {
		...authSchema,
		...usersSchema,
		...gamesSchema,
		...notesSchema,
		...charactersSchema,
		...factionsSchema,
		...imagesSchema,
	},
});
