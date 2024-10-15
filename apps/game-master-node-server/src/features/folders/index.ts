import {
	createFolderSchema,
	updateFolderSchema,
	type FolderWithChildren,
} from "@repo/api/dist/types/folders";
import { Hono } from "hono";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createFolderInsert } from "./utils";
import { folders } from "~/db/schema/notes";
import { db } from "~/db";
import { eq } from "drizzle-orm";

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
			.set(data)
			.where(eq(folders.id, folderId))
			.returning();
		return successResponse(c, updatedFolder);
	} catch (error) {
		return handleDatabaseError(c, error)
	}
});
