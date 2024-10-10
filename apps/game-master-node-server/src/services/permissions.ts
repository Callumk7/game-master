import type { EntityType } from "@repo/api";
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
	permissions: { canView: boolean; canEdit: boolean },
) {
	await db.insert(notesPermissions).values({
		userId,
		noteId,
		canView: permissions.canView,
		canEdit: permissions.canEdit,
	});
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

export async function applyPermissionsToMembers(
	memberList: string[],
	entityId: string,
	entityType: EntityType,
	permissions: { canView: boolean; canEdit: boolean },
) {
	switch (entityType) {
		case "notes":
			for (const memberId of memberList) {
				createNotePermission(memberId, entityId, permissions);
			}
			break;

		case "characters":
			for (const memberId of memberList) {
				createCharacterPermission(memberId, entityId, permissions);
			}
			break;

		case "factions":
			for (const memberId of memberList) {
				createFactionPermission(memberId, entityId, permissions);
			}
			break;

		default:
			break;
	}
}
