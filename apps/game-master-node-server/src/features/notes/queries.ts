import { db } from "~/db";
import { notes, type InsertDatabaseNote } from "~/db/schema/notes";

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
