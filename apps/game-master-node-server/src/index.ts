import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { characterRoute } from "./features/characters";
import { factionRoute } from "./features/factions";
import { folderRoute } from "./features/folders";
import { gamesRoute } from "./features/games";
import { notesRoute } from "./features/notes";
import { usersRoute } from "./features/users";
import { env } from "./lib/env";
import type { Variables } from "./types";
import { pinoLogger } from "hono-pino";
import { getHttpLogger } from "./services/logging";

const logger = getHttpLogger();
const app = new Hono<{ Variables: Variables }>();

// jwt server-to-server validation
app.use(
	"*",
	jwt({
		secret: env.SERVER_SECRET,
	}),
);

app.use(
	"*",
	pinoLogger({
		pino: logger,
	}),
);
app.use("*", cors());
app.route("/users", usersRoute);
app.route("/games", gamesRoute);
app.route("/notes", notesRoute);
app.route("/characters", characterRoute);
app.route("/factions", factionRoute);
app.route("/folders", folderRoute);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export default app;
