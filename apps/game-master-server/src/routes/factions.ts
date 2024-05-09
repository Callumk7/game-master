import { Hono } from "hono";
import { Bindings } from "..";
import { zValidator } from "@hono/zod-validator";
import {
	EntityTypeSchema,
	FactionInsert,
	charactersInFactions,
	createDrizzleForTurso,
	createFactionRequest,
	factionInsertSchema,
	factions,
} from "@repo/db";
import { uuidv4 } from "callum-util";

export const factionsRoute = new Hono<{ Bindings: Bindings }>();

factionsRoute.get("/", async (c) => {
	// Get all of a user's factions
	return c.text("The factions endpoint");
});

factionsRoute.post("/", async (c) => {
	// throws a bad request if the body is the incorrect format
	const newFactionBody = await c.req.json();
	try {
		createFactionRequest.parse(newFactionBody);
	} catch (err) {
		console.error(err);
	}

	console.log(newFactionBody);

	const newFactionId = `fact_${uuidv4()}`;
	const newFactionInsert: FactionInsert = {
		id: newFactionId,
		...newFactionBody,
	};

	const db = createDrizzleForTurso(c.env);
	const newFaction = await db.insert(factions).values(newFactionInsert).returning();

	// Can also link the new entity to the origin request
	const link = c.req.query("link");
	if (link) {
		const linkType = c.req.query("linkType");
		if (!linkType) {
			return c.json({ faction: newFaction, errors: "No link type provided" });
		}
		const parsedLinkType = EntityTypeSchema.parse(linkType);
		switch (parsedLinkType) {
			case "characters":
				await db
					.insert(charactersInFactions)
					.values({ characterId: link, factionId: newFaction[0].id });
				break;

			default:
				break;
		}
	}

	return c.json(newFaction);
});
