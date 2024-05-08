import { createClient } from "@libsql/client";
import * as usersSchema from "./schemas/users";
import * as notesSchema from "./schemas/notes";
import * as charactersSchema from "./schemas/characters";
import * as factionsSchema from "./schemas/factions";
import * as plotsSchema from "./schemas/plots";
import * as sessionsSchema from "./schemas/sessions";
import { drizzle as drizzleTurso } from "drizzle-orm/libsql";

type Bindings = {
	TURSO_CONNECTION_URL: string;
	TURSO_AUTH_TOKEN: string;
	AUTH_KEY: string;
};

// Use this for turso connections
export const createDrizzleForTurso = (env: Bindings) => {
	const CONNECTION_URL = env.TURSO_CONNECTION_URL;
	const AUTH_TOKEN = env.TURSO_AUTH_TOKEN;
	const tursoClient = createClient({
		url: CONNECTION_URL,
		authToken: AUTH_TOKEN,
	});

	return drizzleTurso(tursoClient, {
		schema: {
			...usersSchema,
			...notesSchema,
			...charactersSchema,
			...factionsSchema,
			...plotsSchema,
			...sessionsSchema,
		},
	});
};

export type DB = ReturnType<typeof createDrizzleForTurso>;
