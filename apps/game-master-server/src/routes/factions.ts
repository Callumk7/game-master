import { Hono } from "hono";
import { Bindings } from "..";

export const factionsRoute = new Hono<{ Bindings: Bindings }>();

factionsRoute.get("/", async (c) => {
	// Get all of a user's factions
	return c.text("The factions endpoint");
});
