import {
	type FolderWithChildren,
	createFolderSchema,
	folderInteractionSchema,
	updateFolderSchema,
} from "@repo/api";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { factions } from "~/db/schema/factions";
import { folders, notes } from "~/db/schema/notes";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createFolderInsert } from "./utils";
import { updatedNow } from "~/utils";

export const folderRoute = new Hono();

folderRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createFolderSchema, c);

	const newFolderInsert = createFolderInsert(data);

	try {
		const newFolder = await db
			.insert(folders)
			.values(newFolderInsert)
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newFolder);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.get("/:folderId", async (c) => {
	const folderId = c.req.param("folderId");
	try {
		const folderResult: FolderWithChildren | undefined =
			await db.query.folders.findFirst({
				where: eq(folders.id, folderId),
				with: {
					children: {
						with: {
							characters: true,
							factions: true,
							notes: true,
						},
					},
					characters: true,
					factions: true,
					notes: true,
				},
			});

		if (!folderResult) {
			return handleNotFound(c);
		}

		return c.json(folderResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.delete("/:folderId", async (c) => {
	const folderId = c.req.param("folderId");
	try {
		await db
			.update(notes)
			.set({ folderId: null })
			.where(eq(notes.folderId, folderId));
		await db
			.update(characters)
			.set({ folderId: null })
			.where(eq(characters.folderId, folderId));
		await db
			.update(factions)
			.set({ folderId: null })
			.where(eq(factions.folderId, folderId));
		await db
			.update(folders)
			.set({ parentFolderId: null })
			.where(eq(folders.parentFolderId, folderId));
		await db.delete(folders).where(eq(folders.id, folderId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.patch("/:folderId", async (c) => {
	const folderId = c.req.param("folderId");

	const data = await validateOrThrowError(updateFolderSchema, c);

	try {
		const updatedFolder = await db
			.update(folders)
			.set(updatedNow(data))
			.where(eq(folders.id, folderId))
			.returning();
		return successResponse(c, updatedFolder);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.post("/:folderId/notes", async (c) => {
	const folderId = c.req.param("folderId");
	const { entityId } = await validateOrThrowError(folderInteractionSchema, c);
	try {
		await db.update(notes).set({ folderId }).where(eq(notes.id, entityId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.post("/:folderId/characters", async (c) => {
	const folderId = c.req.param("folderId");
	const { entityId } = await validateOrThrowError(folderInteractionSchema, c);
	try {
		await db.update(characters).set({ folderId }).where(eq(characters.id, entityId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

folderRoute.post("/:folderId/factions", async (c) => {
	const folderId = c.req.param("folderId");
	const { entityId } = await validateOrThrowError(folderInteractionSchema, c);
	try {
		await db.update(factions).set({ folderId }).where(eq(factions.id, entityId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
