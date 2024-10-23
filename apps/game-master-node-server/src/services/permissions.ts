import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { notes, notesPermissions } from "~/db/schema/notes";
import { resolve } from "~/utils";

class PermissionService {
	async canAccessNote(
		userId: string,
		noteId: string,
		requiredLevel: "edit" | "view" = "view",
	) {
		const [note, permission] = await resolve(
			db.query.notes.findFirst({
				where: eq(notes.id, noteId),
			}),
			db.query.notesPermissions.findFirst({
				where: and(
					eq(notesPermissions.noteId, noteId),
					eq(notesPermissions.userId, userId),
				),
			}),
		);

		if (!note) return false;
		if (note.ownerId === userId) return true;

		if (permission) {
			if (permission.permission === "none") return false;
			if (permission.permission === "view") return true;
			return permission.permission === "edit";
		}

		if (note.visibility === "private") return false;
		if (requiredLevel === "view") return true;
		return note.visibility === "public";
	}
}
