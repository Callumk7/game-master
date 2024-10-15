import { z } from "zod";
import type { Character } from "./characters.js";
import type { Faction } from "./factions.js";
import type { Id } from "./index.js";
import type { Note } from "./notes.js";

export interface Folder {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	parentFolderId?: Id | null;
	gameId: Id;
	ownerId: Id;
}

export interface FolderWithChildren extends Folder {
	folders: FolderWithChildren[];
	notes: Note[];
	characters: Character[];
	factions: Faction[];
}

export const createFolderSchema = z.object({
	name: z.string(),
	parentFolderId: z.string().optional(),
	gameId: z.string(),
	ownerId: z.string()
})
export type CreateFolderRequestBody = z.infer<typeof createFolderSchema>;

export const updateFolderSchema = z.object({
	name: z.string().optional(),
	parentFolderId: z.string().optional(),
	gameId: z.string().optional(),
	ownerId: z.string().optional(),
})
export type UpdateFolderRequestBody = z.infer<typeof updateFolderSchema>;
