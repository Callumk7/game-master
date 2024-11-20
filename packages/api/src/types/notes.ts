import { z } from "zod";
import type { Entity } from "./entity.js";
import { type UserPermission, visibilitySchema } from "./index.js";

const noteTypeSchema = z.enum([
	"note",
	"location",
	"character",
	"faction",
	"item",
	"quest",
	"scene",
]);
export type NoteType = z.infer<typeof noteTypeSchema>;

export interface Note extends Entity {
	type: NoteType;
}

export interface NoteWithPermissions extends Note {
	permissions: UserPermission[];
}

export const createNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	gameId: z.string(),
	content: z.string(),
	htmlContent: z.string(),
	type: noteTypeSchema,
	visibility: visibilitySchema,
});
export type CreateNoteRequestBody = z.infer<typeof createNoteSchema>;

export const updateNoteContentSchema = z.object({
	name: z.string().optional(),
	htmlContent: z.string().optional(),
	content: z.string().optional(),
	type: noteTypeSchema.optional(),
	folderId: z.string().optional(),
	visibility: visibilitySchema.optional(),
});
export type UpdateNoteContentRequestBody = z.infer<typeof updateNoteContentSchema>;

export const duplicateNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type DuplicateNoteRequestBody = z.infer<typeof duplicateNoteSchema>;
