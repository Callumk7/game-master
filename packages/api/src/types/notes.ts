import { z } from "zod";
import { visibilitySchema, type Id, type Permission, type Visibility } from "./index.js";

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
	content: string | null;
	htmlContent: string | null;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	folderId: Id | null;
	gameId: Id;
	type: NoteType;
	visibility: Visibility;
}

export interface NoteWithPermissions extends Note {
	permissions: Permission[];
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
});
export type UpdateNoteContentRequestBody = z.infer<typeof updateNoteContentSchema>;

export const duplicateNoteSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type DuplicateNoteRequestBody = z.infer<typeof duplicateNoteSchema>;

export const linkNotesSchema = z.object({
	toIds: z.array(z.string()),
});
export type LinkNotesRequestBody = z.infer<typeof linkNotesSchema>;

export const linkCharactersSchema = z.object({
	characterIds: z.array(z.string()),
});
export type LinkCharactersRequestBody = z.infer<typeof linkCharactersSchema>;

export const linkFactionsSchema = z.object({
	factionIds: z.array(z.string()),
});
export type linkFactionsSchema = z.infer<typeof linkFactionsSchema>;
