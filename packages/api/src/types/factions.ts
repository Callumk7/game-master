import { z } from "zod";
import type { Character } from "./characters.js";
import { visibilitySchema, type Id, type UserPermission, type Visibility } from "./index.js";
import type { Note } from "./notes.js";

export interface Faction {
	id: Id;
	name: string;
	content: string | null;
	htmlContent: string | null;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	gameId: Id;
	leaderId: Id | null;
	visibility: Visibility; 
}

export interface FactionWithMembers extends Faction {
	members: Character[];
}

export interface FactionWithNotes extends Faction {
	notes: Note[];
}

export interface FactionWithPermissions extends Faction {
	permissions: UserPermission[];
}

export const createFactionSchema = z.object({
	name: z.string(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
	coverImageUrl: z.string().optional(),
	ownerId: z.string(),
	gameId: z.string(),
	leaderId: z.string().optional(),
	members: z.array(z.string()).optional(),
});
export type CreateFactionRequestBody = z.infer<typeof createFactionSchema>;

export const updateFactionSchema = z.object({
	name: z.string().optional(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
	coverImageUrl: z.string().optional(),
	leaderId: z.string().optional(),
	visibility: visibilitySchema.optional()
})
export type UpdateFactionRequestBody = z.infer<typeof updateFactionSchema>;

export const duplicateFactionSchema = z.object({
	name: z.string(),
	ownerId: z.string()
})
export type DuplicateFactionRequestBody = z.infer<typeof duplicateFactionSchema>;
