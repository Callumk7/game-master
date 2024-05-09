import { z } from "zod";
import { IntentSchema } from "../api/util";

export const updateNoteSchema = z.object({
	intent: IntentSchema,
	name: z.string().optional(),
	htmlContent: z.string().optional(),
});

export type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;
