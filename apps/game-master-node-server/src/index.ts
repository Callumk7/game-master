import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { usersRoute } from "./features/users";
import { gamesRoute } from "./features/games";
import { logger } from "hono/logger";
import { notesRoute } from "./features/notes";

const app = new Hono();
app.use("*", logger());
app.route("/users", usersRoute);
app.route("/games", gamesRoute);
app.route("/notes", notesRoute);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export default app;
