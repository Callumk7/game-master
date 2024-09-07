import { z } from "zod";
import type { Id } from "./index.js";

export interface Note {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export const createNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	gameId: z.string(),
	htmlContent: z.string(),
});
export type CreateNoteRequestBody = z.infer<typeof createNoteSchema>;
