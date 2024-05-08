import { zValidator } from "@hono/zod-validator";
import { logger } from 'hono/logger';
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
import { allEntitiesRoute } from "~/routes/all";
import { charactersRoute } from "~/routes/characters";
import { factionsRoute } from "./routes/factions";
import { notesRoute } from "./routes/notes";

export type Bindings = {
	TURSO_CONNECTION_URL: string;
	TURSO_AUTH_TOKEN: string;
	AUTH_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
	return c.text("YOU DID IT");
});

app.use(logger())

app.route("/notes", notesRoute);
app.route("/all", allEntitiesRoute);
app.route("/characters", charactersRoute);
app.route("/factions", factionsRoute);

app.post(
	"/auth",
	zValidator(
		"json",
		z.object({
			body: z.string(),
		}),
	),
	async (c) => {
		const { body } = c.req.valid("json");
		const token = await sign({ user: body }, c.env.AUTH_KEY);
		return c.text(token);
	},
);

export default app;
