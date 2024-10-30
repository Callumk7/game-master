import {
	createCharacterSchema,
	createPermissionSchema,
	duplicateCharacterSchema,
	linkFactionsSchema,
	linkNotesSchema,
	updateCharacterSchema,
} from "@repo/api";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createCharacterInsert } from "./util";
import { generateCharacterId } from "~/lib/ids";
import {
	createCharacter,
	createCharacterPermission,
	getCharacterFactions,
	getCharacterNotes,
	getCharactersPrimaryFaction,
	getCharacterWithPermissions,
	linkCharacterToFactions,
	linkCharacterToNotes,
	unlinkCharacterFromFaction,
	updateCharacter,
} from "./queries";
import { PermissionService } from "~/services/permissions";
import { getPayload } from "~/lib/jwt";

export const characterRoute = new Hono();

const getCharacter = async (charId: string) => {
	return await db.query.characters.findFirst({
		where: eq(characters.id, charId),
	});
};

characterRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createCharacterSchema, c);

	const newCharacterInsert = createCharacterInsert(data);

	try {
		const newChar = await createCharacter(newCharacterInsert);
		return successResponse(c, newChar);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.get("/:charId", async (c) => {
	const charId = c.req.param("charId");
	try {
		const characterResult = await getCharacter(charId);
		if (!characterResult) {
			return handleNotFound(c);
		}
		return c.json(characterResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.delete("/:charId", async (c) => {
	const charId = c.req.param("charId");
	try {
		await db.delete(characters).where(eq(characters.id, charId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.patch("/:charId", async (c) => {
	const charId = c.req.param("charId");
	const data = await validateOrThrowError(updateCharacterSchema, c);

	try {
		const charUpdate = await updateCharacter(charId, data);
		return successResponse(c, charUpdate);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.get("/:charId/permissions", async (c) => {
	const charId = c.req.param("charId");
	const { userId } = getPayload(c);
	try {
		const charResult = await getCharacterWithPermissions(charId);
		const userPermissionLevel = PermissionService.calculateUserPermissionLevel({
			userId,
			ownerId: charResult.ownerId,
			globalVisibility: charResult.visibility,
			userPermissions: charResult.permissions,
		});
		charResult.userPermissionLevel = userPermissionLevel;
		return c.json(charResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/:charId/permissions", async (c) => {
	const charId = c.req.param("charId");
	const data = await validateOrThrowError(createPermissionSchema, c);
	try {
		const newPermission = await createCharacterPermission(
			data.userId,
			charId,
			data.permission,
		);
		return successResponse(c, newPermission);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/:charId/duplicate", async (c) => {
	const charId = c.req.param("charId");
	const data = await validateOrThrowError(duplicateCharacterSchema, c);
	try {
		const character = await getCharacter(charId);
		if (!character) return handleNotFound(c);
		const currentDate = new Date();
		const newChar = await db
			.insert(characters)
			.values({
				...character,
				id: generateCharacterId(),
				name: data.name,
				ownerId: data.ownerId,
				createdAt: currentDate,
				updatedAt: currentDate,
			})
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newChar);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                LINKING
////////////////////////////////////////////////////////////////////////////////

// Factions
characterRoute.get("/:charId/factions", async (c) => {
	const charId = c.req.param("charId");
	try {
		const characterFactions = await getCharacterFactions(charId);
		return c.json(characterFactions);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/:charId/factions", async (c) => {
	const charId = c.req.param("charId");
	const { factionIds } = await validateOrThrowError(linkFactionsSchema, c);
	try {
		const links = await linkCharacterToFactions(charId, factionIds);
		return successResponse(c, links);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.delete("/:charId/factions/:factionId", async (c) => {
	const {charId, factionId} = c.req.param();
	try {
		await unlinkCharacterFromFaction(charId, factionId);
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// Notes
characterRoute.get("/:charId/notes", async (c) => {
	const charId = c.req.param("charId");
	try {
		const characterNotes = await getCharacterNotes(charId);
		return c.json(characterNotes);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/:charId/notes", async (c) => {
	const charId = c.req.param("charId");
	const { noteIds } = await validateOrThrowError(linkNotesSchema, c);
	try {
		const links = await linkCharacterToNotes(charId, noteIds);
		return successResponse(c, links);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// Primary Faction
characterRoute.get("/:charId/factions/primary", async (c) => {
	const charId = c.req.param("charId");
	try {
		const factionResult = await getCharactersPrimaryFaction(charId);
		return c.json(factionResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
