import { logger } from "hono/logger";
import { Hono } from "hono";
import { charactersRoute } from "~/routes/characters";
import { factionsRoute } from "./routes/factions";
import { notesRoute } from "./routes/notes";
import { sessionsRoute } from "./routes/sessions";

export type Bindings = {
	TURSO_CONNECTION_URL: string;
	TURSO_AUTH_TOKEN: string;
	AUTH_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.get("/", (c) => {
	return c.text("YOU DID IT");
});

app.route("/notes", notesRoute);
app.route("/characters", charactersRoute);
app.route("/factions", factionsRoute);
app.route("/sessions", sessionsRoute);

export default app;
