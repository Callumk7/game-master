import { z } from "zod";
import { visibilitySchema, type Id, type UserPermission, type Visibility } from "./index.js";
import type { Note } from "./notes.js";
import type { Entity } from "./entity.js";

export interface Character extends Entity {
	isPlayer: boolean;
}

export interface CharacterWithNotes extends Character {
	notes: Note[];
}

export interface CharacterWithPermissions extends Character {
	permissions: UserPermission[];
}

export const createCharacterSchema = z.object({
	name: z.string(),
	content: z.string(),
	htmlContent: z.string(),
	primaryFactionId: z.string().optional(),
	isPlayer: z.boolean().optional(),
	ownerId: z.string(),
	gameId: z.string()
})
export type CreateCharacterRequestBody = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = z.object({
	name: z.string().optional(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
	isPlayer: z.boolean().optional(),
	folderId: z.string().optional(),
	visibility: visibilitySchema.optional(),
	primaryFactionId: z.string().optional()

})
export type UpdateCharacterRequestBody = z.infer<typeof updateCharacterSchema>;

export const duplicateCharacterSchema = z.object({
	name: z.string(),
	ownerId: z.string()
})
export type DuplicateCharacterRequestBody = z.infer<typeof duplicateCharacterSchema>;

export const linkCharacterSchema = z.object({
	toIds: z.array(z.string()),
})
