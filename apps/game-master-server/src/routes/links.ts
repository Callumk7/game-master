import { Hono } from "hono";
import type { Bindings } from "..";
import { internalServerError } from "~/utils";
import {
	EntityTypeSchema,
	LinkIntentSchema,
	OptionalEntitySchema,
	badRequest,
	createDrizzleForTurso,
	handleCharacterLinking,
	handleFactionLinking,
	handleNoteLinking,
	handleSessionLinking,
} from "@repo/db";
import { zx } from "zodix";

export const linksRoute = new Hono<{ Bindings: Bindings }>();

linksRoute.post("/:targetId", async (c) => {
	const targetId = c.req.param("targetId");

	// we need the type, searchParam
	const { targetType } = c.req.query();

	if (!targetType) {
		console.log("No target type was provided");
		throw internalServerError();
	}

	const parsedTarget = EntityTypeSchema.safeParse(targetType);

	if (!parsedTarget.success) {
		throw badRequest("Failed to parse entity type");
	}

	const { intent, targetIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);

	switch (parsedTarget.data) {
		case "factions":
			await handleFactionLinking(db, targetId, targetIds, intent);
			break;

		case "characters":
			await handleCharacterLinking(db, targetId, targetIds, intent);
			break;

		case "sessions":
			await handleSessionLinking(db, targetId, targetIds, intent);
			break;
		case "plots":
			console.log("Linking for plots is not currently supported");
			break;
		case "notes":
			await handleNoteLinking(db, targetId, targetIds, intent);
			break;
		default:
			break;
	}
});
