import { z } from "zod";
import type { Entity } from "./entity.js";
import type { Faction } from "./factions.js";
import { type UserPermission, visibilitySchema } from "./index.js";
import type { Note } from "./notes.js";

export interface Character extends Entity {
	level: number;
	characterClass?: string | null;
	race?: string | null;
	strength?: number | null;
	dexterity?: number | null;
	constitution?: number | null;
	intelligence?: number | null;
	wisdom?: number | null;
	charisma?: number | null;
	personality?: string | null;
	goal?: string | null;
	flaw?: string | null;
	isPlayer: boolean;
}

export interface CharacterWithFaction extends Character {
	primaryFaction: Faction | null;
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
	gameId: z.string(),
	race: z.string().optional(),
	level: z.number().optional(),
	characterClass: z.string().optional(),
	strength: z.number().optional(),
	dexterity: z.number().optional(),
	constitution: z.number().optional(),
	wisdom: z.number().optional(),
	intelligence: z.number().optional(),
	charisma: z.number().optional(),
	goal: z.string().optional(),
	personality: z.string().optional(),
	flaw: z.string().optional(),
	factionId: z.string().optional()
});
export type CreateCharacterRequestBody = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = z.object({
	name: z.string().optional(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
	isPlayer: z.boolean().optional(),
	folderId: z.string().optional(),
	visibility: visibilitySchema.optional(),
	primaryFactionId: z.string().optional(),
	race: z.string().optional(),
	level: z.number().optional(),
	characterClass: z.string().optional(),
	strength: z.number().optional(),
	dexterity: z.number().optional(),
	constitution: z.number().optional(),
	wisdom: z.number().optional(),
	intelligence: z.number().optional(),
	charisma: z.number().optional(),
	goal: z.string().optional(),
	personality: z.string().optional(),
	flaw: z.string().optional(),
});
export type UpdateCharacterRequestBody = z.infer<typeof updateCharacterSchema>;

export const duplicateCharacterSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type DuplicateCharacterRequestBody = z.infer<typeof duplicateCharacterSchema>;

export const linkCharacterSchema = z.object({
	toIds: z.array(z.string()),
});
