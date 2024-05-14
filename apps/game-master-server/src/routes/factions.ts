import { Hono } from "hono";
import { Bindings } from "..";
import {
	EntityTypeSchema,
	FactionInsert,
	LINK_INTENT,
	LinkIntentSchema,
	badRequest,
	charactersInFactions,
	charactersInFactionsInsertSchema,
	createDrizzleForTurso,
	deleteCharactersFromFaction,
	factionInsertSchema,
	factions,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { z } from "zod";
import { itemOrArrayToArray } from "~/utils";
import { zx } from "zodix";
import { and, eq } from "drizzle-orm";

export const factionsRoute = new Hono<{ Bindings: Bindings }>();

factionsRoute.get("/", async (c) => {
	// Get all of a user's factions
	return c.text("The factions endpoint");
});

factionsRoute.post("/", async (c) => {
	// throws a bad request if the body is the incorrect format
	const newFactionBody = await zx.parseForm(
		c.req.raw,
		factionInsertSchema.omit({ id: true }),
	);

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

factionsRoute.post("/:factionId/links", async (c) => {
	const { type } = c.req.query();
	if (!type) {
		return badRequest("No type query parameter was provided");
	}
	const intentResult = LinkIntentSchema.safeParse(type);
	if (!intentResult.success) {
		return badRequest("Incorrect link type provided");
	}

	const db = createDrizzleForTurso(c.env);
	switch (intentResult.data) {
		case LINK_INTENT.CHARACTERS: {
			const linkInsert = await zx.parseForm(
				c.req.raw,
				charactersInFactionsInsertSchema,
			);
			await db.insert(charactersInFactions).values(linkInsert);
			return c.json(linkInsert);
		}

		default:
			break;
	}
});

// Here we are going to handle how members are added and removed from factions
const members = new Hono<{ Bindings: Bindings }>();
members.get("/", (c) => {
	return c.text("This is found");
});
members.post("/", async (c) => {
	const linkInsert = await zx.parseForm(c.req.raw, charactersInFactionsInsertSchema);

	const db = createDrizzleForTurso(c.env);
	const newLink = await db.insert(charactersInFactions).values(linkInsert);
	return c.json(newLink);
});

members.put("/:characterId", async (c) => {
	const factionId = c.req.param("factionId");
	const characterId = c.req.param("characterId");
	const { role, description } = await zx.parseForm(c.req.raw, {
		role: z.string().optional(),
		description: z.string().optional(),
	});

	const db = createDrizzleForTurso(c.env);

	// WARN: not sure what happens if the ids are wrong, does it throw?
	const result = await db
		.update(charactersInFactions)
		.set({ role, description })
		.where(
			and(
				eq(charactersInFactions.characterId, characterId),
				eq(charactersInFactions.factionId, factionId!),
			),
		);

	return c.json("done");
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
