import {
	createCharacterSchema,
	createPermissionSchema,
	duplicateCharacterSchema,
	updateCharacterSchema,
	type CharacterWithNotes,
	type CharacterWithPermissions,
	type NoteType,
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
import { createCharacterPermission } from "~/services/permissions";

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
		const newChar = await db
			.insert(characters)
			.values(newCharacterInsert)
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newChar);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.get("/:charId", async (c) => {
	const charId = c.req.param("charId");
	try {
		const characterResult = await db.query.characters.findFirst({
			where: eq(characters.id, charId),
		});
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
		const charUpdate = await db
			.update(characters)
			.set(data)
			.where(eq(characters.id, charId))
			.returning()
		return successResponse(c, charUpdate);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.get("/:charId/permissions", async (c) => {
	const charId = c.req.param("charId");
	try {
		const result: CharacterWithPermissions | undefined =
			await db.query.characters.findFirst({
				where: eq(characters.id, charId),
				with: {
					permissions: {
						columns: {
							userId: true,
							permission: true,
						},
					},
				},
			});

		if (!result) {
			return handleNotFound(c);
		}

		return c.json(result)
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

characterRoute.get("/:charId/notes", async (c) => {
	const charId = c.req.param("charId");
	try {
		const result = await db.query.characters.findFirst({
			where: eq(characters.id, charId),
			with: {
				notes: {
					with: {
						note: true,
					},
				},
			},
		});
		if (!result) {
			return handleNotFound(c);
		}
		const charWithNotes: CharacterWithNotes = {
			...result,
			notes: result.notes.map((note) => ({
				...note.note,
				type: note.note.type as NoteType,
			})),
		};
		return c.json(charWithNotes);
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
