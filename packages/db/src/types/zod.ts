import { z } from "zod";

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
