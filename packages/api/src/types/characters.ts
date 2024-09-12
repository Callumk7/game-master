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
