import { Hono } from "hono";
import type { Bindings } from "..";
import { internalServerError } from "~/utils";
import {
	LinkIntentSchema,
	OptionalEntitySchema,
	createDrizzleForTurso,
	deleteCharacterJoinsFromNote,
	deleteFactionJoinsFromNote,
	deleteNoteConnectionsFromNote,
	deletePlotJoinsFromNote,
	deleteSessionJoinsFromNote,
	handleLinkingByIntent,
	linkCharactersToNote,
	linkFactionsToNote,
	linkNotesTogether,
	linkPlotsToNote,
	linkSessionsToNote,
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

	const { intent, targetIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	const res = await handleLinkingByIntent(db, targetId, targetIds, intent, {
		characters: {
			link: linkCharactersToNote,
			delete: deleteCharacterJoinsFromNote,
		},
		factions: {
			link: linkFactionsToNote,
			delete: deleteFactionJoinsFromNote,
		},
		notes: {
			link: linkNotesTogether,
			delete: deleteNoteConnectionsFromNote,
		},
		plots: {
			link: linkPlotsToNote,
			delete: deletePlotJoinsFromNote,
		},
		sessions: {
			link: linkSessionsToNote,
			delete: deleteSessionJoinsFromNote,
		},
	});
});
