import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { usersRoute } from "./features/users";
import { gamesRoute } from "./features/games";

const app = new Hono();
app.route("/users", usersRoute);
app.route("/games", gamesRoute);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export default app;
