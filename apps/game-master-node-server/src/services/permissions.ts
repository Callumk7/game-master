import type { EntityType, Permission } from "@repo/api";
import { sql } from "drizzle-orm";
import { db } from "~/db";
import { charactersPermissions } from "~/db/schema/characters";
import { factionsPermissions } from "~/db/schema/factions";
import { notesPermissions } from "~/db/schema/notes";

// WARN: I am not using any of this code in the routes, because the logic isnt correct.
// It is bad to have a separate DB call for each member - instead, I should batch the inserts
// and do a single call. The only issue is I need to do a check for the owner, and make sure they
// have full permissions.

export async function createNotePermission(
	userId: string,
	noteId: string,
	permission: Permission
) {
	const result = await db
		.insert(notesPermissions)
		.values({
			userId,
			noteId,
			permission
		})
		.onConflictDoUpdate({
			target: [notesPermissions.userId, notesPermissions.noteId],
			set: {
				permission: sql`excluded.permission`
			},
		})
		.returning()
		.then((rows) => rows[0]);

	if (!result) {
		throw new Error("Error creating permission in database");
	}

	return result;
}

export async function createCharacterPermission(
	userId: string,
	characterId: string,
	permissions: { canView: boolean; canEdit: boolean },
) {
	await db.insert(charactersPermissions).values({
		userId,
		characterId,
		canView: permissions.canView,
		canEdit: permissions.canEdit,
	});
}

export async function createFactionPermission(
	userId: string,
	factionId: string,
	permissions: { canView: boolean; canEdit: boolean },
) {
	await db.insert(factionsPermissions).values({
		userId,
		factionId,
		canView: permissions.canView,
		canEdit: permissions.canEdit,
	});
}
