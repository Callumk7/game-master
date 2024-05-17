import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { charactersRoute } from "~/routes/characters";
import { factionsRoute } from "./routes/factions";
import { foldersRoute } from "./routes/folders";
import { locationsRoute } from "./routes/locations";
import { notesRoute } from "./routes/notes";
import { racesRoute } from "./routes/races";
import { sessionsRoute } from "./routes/sessions";
import { badRequest, createDrizzleForTurso, getAllUserEntities } from "@repo/db";
import { getUserIdQueryParam } from "./utils";

export type Bindings = {
	TURSO_CONNECTION_URL: string;
	TURSO_AUTH_TOKEN: string;
	AUTH_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());
app.use(async (c, next) => {
	const auth = bearerAuth({ token: c.env.AUTH_KEY });
	await auth(c, next);
});

// All user entities
app.get("/", async (c) => {
	const userId = getUserIdQueryParam(c);
	const db = createDrizzleForTurso(c.env);
	const userData = await getAllUserEntities(db, userId);
	return c.json(userData);
});

app.route("/notes", notesRoute);
app.route("/characters", charactersRoute);
app.route("/factions", factionsRoute);
app.route("/sessions", sessionsRoute);
app.route("/locations", locationsRoute);
app.route("/folders", foldersRoute);
app.route("/races", racesRoute);

export default app;
