import { z } from "zod";
import type { BasicEntity, Id } from "./index.js";
import type { Note } from "./notes.js";
import type { Character } from "./characters.js";
import type { Faction } from "./factions.js";

export interface Game {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export interface GameWithEntities extends Game {
	notes: BasicEntity[];
	characters: BasicEntity[];
	factions: BasicEntity[];
}

export interface GameWithCharacters extends Game {
	characters: Character[];
}

export interface GameWithNotes extends Game {
	notes: Note[];
}

export interface GameWithData extends Game {
	notes: Note[];
	characters: Character[];
	factions: Faction[];
}

export interface GameEntities {
	notes: BasicEntity[];
	characters: BasicEntity[];
	factions: BasicEntity[];
}

export interface GameWithNestedData extends GameWithNotes {
	characters: Character & { notes: Id[] };
	factions: Faction & { notes: Id[]; members: Id[] };
}

export const createGameSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type CreateGameRequestBody = z.infer<typeof createGameSchema>;

export const updateGameSchema = z.object({
	name: z.string().optional(),
	content: z.string().optional(),
	htmlContent: z.string().optional(),
	ownerId: z.string().optional(),
});
export type UpdateGameRequestBody = z.infer<typeof updateGameSchema>;
