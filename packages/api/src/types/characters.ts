import { z } from "zod";
import type { Id } from "./index.js";
import type { Note } from "./notes.js";

export interface Character {
	id: Id;
	name: string;
	content: string | null;
	htmlContent: string | null;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	gameId: Id;
	isPlayer: boolean;
}

export interface CharacterWithNotes extends Character {
	notes: Note[];
}

export const createCharacterSchema = z.object({
	name: z.string(),
	content: z.string(),
	htmlContent: z.string(),
	ownerId: z.string(),
	gameId: z.string()
})
export type CreateCharacterRequestBody = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = z.object({
	name: z.string().optional(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
})
export type UpdateCharacterRequestBody = z.infer<typeof updateCharacterSchema>;

export const duplicateCharacterSchema = z.object({
	name: z.string(),
	ownerId: z.string()
})
export type DuplicateCharacterRequestBody = z.infer<typeof duplicateCharacterSchema>;
