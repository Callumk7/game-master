import { createFactionSchema } from "@repo/api/dist/types/factions";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { factions } from "~/db/schema/factions";
import {
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createFactionInsert } from "./util";

export const factionRoute = new Hono();

factionRoute.get("/:factionId", async (c) => {
	const factionId = c.req.param("factionId");
	try {
		const factionResult = await db.query.factions.findFirst({
			where: eq(factions.id, factionId),
		});
		if (!factionResult) {
			return handleNotFound(c);
		}
		return c.json(factionResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createFactionSchema, c);

	const newFactionInsert = createFactionInsert(data);

	try {
		const newFaction = await db
			.insert(factions)
			.values(newFactionInsert)
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newFaction);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
