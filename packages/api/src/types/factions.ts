import { z } from "zod";
import type { Character } from "./characters.js";
import type { Id } from "./index.js";
import type { Note } from "./notes.js";

export interface Faction {
	id: Id;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export interface FactionWithMembers extends Faction {
	members: Character[];
}

export interface FactionWithNotes extends Faction {
	notes: Note[];
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
})
export type UpdateFactionRequestBody = z.infer<typeof updateFactionSchema>;
