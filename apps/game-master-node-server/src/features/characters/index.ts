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
import { images } from "~/db/schema/images";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { generateCharacterId } from "~/lib/ids";
import { getPayload } from "~/lib/jwt";
import { s3 } from "~/lib/s3";
import { PermissionService } from "~/services/permissions";
import { validateUploadIsImageOrThrow } from "~/utils";
import {
	createCharacter,
	createCharacterPermission,
	getCharacterFactions,
	getCharacterImages,
	getCharacterNotes,
	getCharacterWithPermissions,
	getCharactersPrimaryFaction,
	linkCharacterToFactions,
	linkCharacterToNotes,
	unlinkCharacterFromFaction,
	updateCharacter,
	updateCharacterNotes,
	updateCharacterToFactionLinks,
} from "./queries";
import { createCharacterInsert } from "./util";

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

characterRoute.put("/:charId/factions", async (c) => {
	const charId = c.req.param("charId");
	const { factionIds } = await validateOrThrowError(linkFactionsSchema, c);
	try {
		const links = await updateCharacterToFactionLinks(charId, factionIds);
		return successResponse(c, links);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.delete("/:charId/factions/:factionId", async (c) => {
	const { charId, factionId } = c.req.param();
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

characterRoute.put("/:charId/notes", async (c) => {
	const charId = c.req.param("charId");
	const { noteIds } = await validateOrThrowError(linkNotesSchema, c);
	try {
		const links = await updateCharacterNotes(charId, noteIds);
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

////////////////////////////////////////////////////////////////////////////////
//                                IMAGES
////////////////////////////////////////////////////////////////////////////////

characterRoute.post("/:charId/cover", async (c) => {
	const charId = c.req.param("charId");
	const { ownerId, image } = await validateUploadIsImageOrThrow(c.req);
	let imageUrl: string;
	try {
		const result = await s3.upload(image, { ownerId, entityId: charId });
		imageUrl = result.imageUrl;
	} catch (error) {
		console.error(error);
		return handleDatabaseError(c, "The error was caught in the images route");
	}

	try {
		// could be a function shared with the service above
		const update = await db
			.update(characters)
			.set({ coverImageUrl: imageUrl })
			.where(eq(characters.id, charId))
			.returning();

		return successResponse(c, update);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/:charId/images", async (c) => {
	const charId = c.req.param("charId");
	const { ownerId, image } = await validateUploadIsImageOrThrow(c.req);
	let imageUrl: string;
	let imageId: string;
	try {
		const result = await s3.upload(image, { ownerId, entityId: charId });
		imageUrl = result.imageUrl;
		imageId = result.imageId;
	} catch (error) {
		console.error(error);
		return handleDatabaseError(c, "The error was caught in the images route");
	}

	try {
		const imageResult = await db
			.insert(images)
			.values({ id: imageId, ownerId, characterId: charId, imageUrl })
			.returning()
			.then((result) => result[0]);

		if (!imageResult) {
			return handleDatabaseError(c, "image result not returned from database");
		}

		return successResponse(c, imageResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.get("/:charId/images", async (c) => {
	const charId = c.req.param("charId");
	try {
		const charImages = await getCharacterImages(charId);
		return c.json(charImages);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
