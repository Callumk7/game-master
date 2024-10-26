import { z } from "zod";

export const linkNotesSchema = z.object({
	noteIds: z.array(z.string()),
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
