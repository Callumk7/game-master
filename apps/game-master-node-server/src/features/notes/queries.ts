import type {
	NoteWithPermissions,
	Permission,
	UpdateNoteContentRequestBody,
} from "@repo/api";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { type InsertDatabaseNote, notes, notesPermissions } from "~/db/schema/notes";
import { updatedNow } from "~/utils";

export const createNote = async (insert: InsertDatabaseNote) => {
	const result = await db
		.insert(notes)
		.values(insert)
		.returning()
		.then((result) => result[0]);

	if (!result) {
		throw new Error("Database failed to create a new note");
	}

	return result;
};

export const updateNote = async (
	noteId: string,
	noteUpdate: UpdateNoteContentRequestBody,
) => {
	const noteUpdateResult = await db
		.update(notes)
		.set(updatedNow(noteUpdate))
		.where(eq(notes.id, noteId))
		.returning()
		.then((result) => result[0]);

	if (!noteUpdateResult) {
		throw new Error("Unable to return data from database");
	}

	return noteUpdateResult;
};

export const getNoteWithPermissions = async (
	noteId: string,
): Promise<NoteWithPermissions> => {
	const noteResult = await db.query.notes.findFirst({
		where: eq(notes.id, noteId),
		with: {
			permissions: {
				columns: {
					userId: true,
					permission: true,
				},
			},
		},
	});

	if (!noteResult) {
		throw new Error("Unable to find note in database");
	}

	return noteResult;
};

export async function createNotePermission(
	userId: string,
	noteId: string,
	permission: Permission,
) {
	const result = await db
		.insert(notesPermissions)
		.values({
			userId,
			noteId,
			permission,
		})
		.onConflictDoUpdate({
			target: [notesPermissions.userId, notesPermissions.noteId],
			set: {
				permission: sql`excluded.permission`,
			},
		})
		.returning()
		.then((rows) => rows[0]);

	if (!result) {
		throw new Error("Error creating permission in database");
	}

	return result;
}
