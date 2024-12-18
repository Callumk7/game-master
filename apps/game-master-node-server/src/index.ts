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
import { httpLogger } from "./middleware/logging";
import { setupLogging } from "./services/logging";
import type { Variables } from "./types";

await setupLogging();

const app = new Hono<{ Variables: Variables }>();
app.use("*", cors());
// Healthcheck
app.get("/", (c) => c.text("OK"));

// This will apply JWT middleware to all routes except "/"
app.use(
	"*",
	jwt({
		secret: env.SERVER_SECRET,
	}),
);

// Application routes
app.use("*", httpLogger);
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
