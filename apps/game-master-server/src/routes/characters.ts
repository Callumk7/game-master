import { Hono } from "hono";
import { Bindings } from "..";
import { userIdValidator } from "~/lib/validators";
import { createDrizzleForTurso } from "~/db";
import { getAllUserCharacters } from "~/api/characters";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

charactersRoute.get("/", (c) => {
	return c.text("This is here");
});

charactersRoute.post("/", userIdValidator, async (c) => {
	const { userId } = c.req.valid("form");
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await getAllUserCharacters(db, userId);
	return c.json(allCharacters);
});
