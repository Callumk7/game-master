import { Hono } from "hono";
import { Bindings } from "..";
import {
	FolderInsert,
	badRequest,
	createDrizzleForTurso,
	folders,
	foldersInsertSchema,
	notes,
} from "@repo/db";
import { eq } from "drizzle-orm";
import { zx } from "zodix";
import { uuidv4 } from "callum-util";
import { z } from "zod";

export const foldersRoute = new Hono<{ Bindings: Bindings }>();

foldersRoute.get("/", async (c) => {
	const { userId } = c.req.query();
	if (!userId) {
		return badRequest("No userId provided");
	}
	const db = createDrizzleForTurso(c.env);
	const allFolders = await db.select().from(folders).where(eq(folders.userId, userId));
	return c.json(allFolders);
});

foldersRoute.post("/", async (c) => {
	const newFolderData = await zx.parseForm(
		c.req.raw,
		foldersInsertSchema.omit({ id: true }).extend({ noteId: z.string().optional() }),
	);

	const db = createDrizzleForTurso(c.env);
	const allFolders = await db
		.select()
		.from(folders)
		.where(eq(folders.userId, newFolderData.userId));

	const dbFolder = allFolders.find((f) => f.name === newFolderData.name);

	if (dbFolder) {
		await db
			.update(notes)
			.set({ folderId: dbFolder.id })
			.where(eq(notes.id, newFolderData.noteId!));
		return c.json(dbFolder);
	}

	const newFolderInsert: FolderInsert = {
		id: `fold_${uuidv4()}`,
		...newFolderData,
	};

	const newFolder = await db.insert(folders).values(newFolderInsert).returning();
	await db
		.update(notes)
		.set({ folderId: newFolder[0].id })
		.where(eq(notes.id, newFolderData.noteId!));
	return c.json(newFolder);
});
