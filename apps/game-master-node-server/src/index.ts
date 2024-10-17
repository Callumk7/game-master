import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { usersRoute } from "./features/users";
import { gamesRoute } from "./features/games";
import { logger } from "hono/logger";
import { notesRoute } from "./features/notes";
import { characterRoute } from "./features/characters";
import { factionRoute } from "./features/factions";
import { cors } from "hono/cors";
import { folderRoute } from "./features/folders";

const app = new Hono();
app.use("*", logger());
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
