import { z } from "zod";
import { IntentSchema } from "../api/util";

export const updateNoteSchema = z.object({
	noteId: z.string(),
	intent: IntentSchema,
	name: z.string().optional(),
	htmlContent: z.string().optional(),
});

export type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;
