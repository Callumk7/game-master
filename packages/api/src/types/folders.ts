import { z } from "zod";
import type { Character } from "./characters.js";
import type { Faction } from "./factions.js";
import type { BasicEntityWithDates, Id, Visibility } from "./index.js";
import type { Note } from "./notes.js";

export interface Folder {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	parentFolderId?: Id | null;
	gameId: Id;
	ownerId: Id;
	visibility: Visibility;
}

export interface FolderWithChildren extends Folder {
	children?: FolderWithChildren[];
	notes: Note[];
	characters: Character[];
	factions: Faction[];
}

export interface FolderWithDatedEntities extends Folder {
	children?: FolderWithDatedEntities[];
	notes: BasicEntityWithDates[];
	characters: BasicEntityWithDates[];
	factions: BasicEntityWithDates[];
}

export const createFolderSchema = z.object({
	name: z.string(),
	parentFolderId: z.string().optional(),
	gameId: z.string(),
	ownerId: z.string(),
});
export type CreateFolderRequestBody = z.infer<typeof createFolderSchema>;

export const updateFolderSchema = z.object({
	name: z.string().optional(),
	parentFolderId: z.string().optional(),
	gameId: z.string().optional(),
	ownerId: z.string().optional(),
});
export type UpdateFolderRequestBody = z.infer<typeof updateFolderSchema>;

export const folderInteractionSchema = z.object({
	entityId: z.string(),
});
export type FolderInteractionRequestBody = z.infer<typeof folderInteractionSchema>;
