import type { EntityType } from "@repo/api";

export function factionHref(gameId: string, factionId: string) {
	return `/games/${gameId}/factions/${factionId}`;
}

export function characterHref(gameId: string, charId: string) {
	return `/games/${gameId}/characters/${charId}`;
}

export function noteHref(gameId: string, noteId: string) {
	return `/games/${gameId}/notes/${noteId}`;
}

export function folderHref(gameId: string, folderId: string) {
	return `/games/${gameId}/folders/${folderId}`;
}

export function hrefFor(entityType: EntityType, gameId: string, entityId: string) {
	return `/games/${gameId}/${entityType}/${entityId}`;
}
