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
	content: string;
	htmlContent: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	type: NoteType;
}

export const createNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	gameId: z.string(),
	content: z.string(),
	htmlContent: z.string(),
	type: noteTypeSchema,
});
export type CreateNoteRequestBody = z.infer<typeof createNoteSchema>;

export const updateNoteContentSchema = z.object({
	name: z.string().optional(),
	htmlContent: z.string().optional(),
	content: z.string().optional()
})
export type UpdateNoteContentRequestBody = z.infer<typeof updateNoteContentSchema>;

export const duplicateNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string()
})
export type DuplicateNoteRequestBody = z.infer<typeof duplicateNoteSchema>;
