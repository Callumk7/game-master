import { z } from "zod";
import type { Id } from "./index.js";

const noteTypeSchema = z.enum([
	"note",
	"location",
	"character",
	"faction",
	"item",
	"quest",
]);
export type NoteType = z.infer<typeof noteTypeSchema>;

export interface Note {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	type: NoteType;
}

export const createNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	gameId: z.string(),
	htmlContent: z.string(),
	type: noteTypeSchema,
});
export type CreateNoteRequestBody = z.infer<typeof createNoteSchema>;
