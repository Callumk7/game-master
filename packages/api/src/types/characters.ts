import { z } from "zod";
import type { Id } from "./index.js";

export interface Character {
	id: Id;
	name: string;
	content: string;
	htmlContent: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	gameId: Id;
	isPlayer: boolean;
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
