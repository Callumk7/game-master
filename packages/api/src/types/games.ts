import { z } from "zod";
import type { Id } from "./index.js";

export interface Game {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export const createGameSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type CreateGameRequestBody = z.infer<typeof createGameSchema>;
