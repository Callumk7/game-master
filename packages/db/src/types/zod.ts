import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { characters } from "~/db/schemas";

export const OptionalEntitySchema = z
	.array(z.string())
	.or(z.string())
	.optional();
export type MultiSelectString = z.infer<typeof OptionalEntitySchema>;

export const EntityTypeSchema = z.enum([
	"characters",
	"factions",
	"sessions",
	"plots",
	"notes",
]);

export const LoginBodySchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const charactersInsertSchema = createInsertSchema(characters);
export const characersSelectSchema = createSelectSchema(characters);
export const createCharacterRequest = charactersInsertSchema.omit({ id: true });

export type Character = z.infer<typeof characersSelectSchema>;
export type CharacterInsert = z.infer<typeof charactersInsertSchema>;
