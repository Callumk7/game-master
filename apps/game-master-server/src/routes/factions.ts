import { Hono } from "hono";
import type { Bindings } from "..";
import {
	EntityTypeSchema,
	type FactionInsert,
	LINK_INTENT,
	LinkIntentSchema,
	badRequest,
	charactersInFactions,
	charactersInFactionsInsertSchema,
	createDrizzleForTurso,
	createFaction,
	deleteCharactersFromFaction,
	factionInsertSchema,
	factions,
	OptionalEntitySchema,
	handleBulkFactionLinking,
	charactersInsertSchema,
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
	const newFaction = await createFaction(db, newFactionInsert);

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
					.values({ characterId: link, factionId: newFaction.id });
				break;

			default:
				break;
		}
	}

	return c.json(newFaction);
});

factionsRoute.patch("/:factionId", async (c) => {
	const factionId = c.req.param("factionId");
	const factionUpdateData = await zx.parseForm(
		c.req.raw,
		factionInsertSchema.partial(),
	);
	console.log(factionUpdateData);
	const db = createDrizzleForTurso(c.env);
	const updatedFaction = await db
		.update(factions)
		.set(factionUpdateData)
		.where(eq(factions.id, factionId))
		.returning();

	console.log(updatedFaction);
	return c.json(updatedFaction);
});

factionsRoute.post("/:factionId/links", async (c) => {
	const factionId = c.req.param("factionId");
	const { intent, linkIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		linkIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	return await handleBulkFactionLinking(db, factionId, linkIds, intent);
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

members.patch("/:characterId", async (c) => {
	const factionId = c.req.param("factionId") as string;
	const characterId = c.req.param("characterId");
	const { role, description } = await zx.parseForm(c.req.raw, {
		role: z.string().optional(),
		description: z.string().optional(),
	});
	const db = createDrizzleForTurso(c.env);
	const result = await db
		.update(charactersInFactions)
		.set({ role, description })
		.where(
			and(
				eq(charactersInFactions.characterId, characterId),
				eq(charactersInFactions.factionId, factionId),
			),
		)
		.returning();
	return c.json(result);
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
