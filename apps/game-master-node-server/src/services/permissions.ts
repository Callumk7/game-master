import type { EntityType } from "@repo/api";
import { db } from "~/db";
import { charactersPermissions } from "~/db/schema/characters";
import { factionsPermissions } from "~/db/schema/factions";
import { notesPermissions } from "~/db/schema/notes";

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
