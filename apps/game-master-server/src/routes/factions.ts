import { Hono } from "hono";
import { Bindings } from "..";
import { zValidator } from "@hono/zod-validator";
import {
	EntityTypeSchema,
	FactionInsert,
	OptionalEntitySchema,
	charactersInFactions,
	createDrizzleForTurso,
	createFactionRequest,
	deleteCharactersFromFaction,
	factionInsertSchema,
	factions,
	linkCharactersToFaction,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { z } from "zod";
import { itemOrArrayToArray } from "~/utils";

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

// Here we are going to handle how members are added and removed from factions
const members = new Hono<{ Bindings: Bindings }>();
members.get("/", (c) => {
	return c.text("This is found");
});
members.post("/", async (c) => {
	const factionId = c.req.param("factionId");
	// get the character Ids (or throw)
	const { characterIds } = z
		.object({ characterIds: OptionalEntitySchema })
		.parse(await c.req.json());
	const parsedIds = itemOrArrayToArray(characterIds);
	const db = createDrizzleForTurso(c.env);
	const newLink = await linkCharactersToFaction(db, factionId!, parsedIds);
	return c.json(newLink);
});

members.delete("/:characterId", async (c) => {
	const factionId = c.req.param("factionId");
	const characterId = c.req.param("characterId");
	const parsedIds = itemOrArrayToArray(characterId);
	const db = createDrizzleForTurso(c.env);
	await deleteCharactersFromFaction(db, factionId!, parsedIds);
	return c.text("Deleted");
});

factionsRoute.route("/:factionId/members", members);
