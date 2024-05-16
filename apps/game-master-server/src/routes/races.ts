import { Hono } from "hono";
import type { Bindings } from "..";
import { RaceInsert, createDrizzleForTurso, races, racesInsertSchema } from "@repo/db";
import { zx } from "zodix";
import { uuidv4 } from "callum-util";

export const racesRoute = new Hono<{ Bindings: Bindings }>();

// get all races
racesRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allRaces = await db.select().from(races);
	return c.json(allRaces);
});

racesRoute.post("/", async (c) => {
	const newRaceData = await zx.parseForm(
		c.req.raw,
		racesInsertSchema.omit({ id: true }),
	);

	const newRaceInsert: RaceInsert = {
		id: `race_${uuidv4()}`,
		...newRaceData,
	};

	const db = createDrizzleForTurso(c.env);
	const newRace = await db
		.insert(races)
		.values(newRaceInsert)
		.returning()
		.then((result) => result[0]);
	return c.json(newRace);
});
