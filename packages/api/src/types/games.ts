import { z } from "zod";
import type { Character } from "./characters.js";
import type { Faction } from "./factions.js";
import type { FolderWithDatedEntities } from "./folders.js";
import {
	type BasicEntity,
	type BasicEntityWithDates,
	type Id,
	OptionalEntitySchema,
} from "./index.js";
import type { Note } from "./notes.js";
import { type GameMember, roleSchema } from "./users.js";

export interface Game {
	id: Id;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export interface GameWithMembers extends Game {
	members: GameMember[];
}

export interface GameWithEntities extends Game {
	notes: BasicEntity[];
	characters: BasicEntity[];
	factions: BasicEntity[];
}

export interface GameWithDatedEntities extends Game {
	folders?: FolderWithDatedEntities[];
	notes: BasicEntityWithDates[];
	characters: BasicEntityWithDates[];
	factions: BasicEntityWithDates[];
}

export interface GameWithCharacters extends Game {
	characters: Character[];
}

export interface GameWithNotes extends Game {
	notes: Note[];
}

export interface GameEntities {
	notes: BasicEntity[];
	characters: BasicEntity[];
	factions: BasicEntity[];
}

export const createGameSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});
export type CreateGameRequestBody = z.infer<typeof createGameSchema>;

export const updateGameSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	ownerId: z.string().optional(),
});
export type UpdateGameRequestBody = z.infer<typeof updateGameSchema>;

export const addMemberSchema = z.object({
	userId: z.string(),
});
export type AddMemberRequestBody = z.infer<typeof addMemberSchema>;

export const updateMemberSchema = z.object({
	role: roleSchema.optional(),
	isOwner: z.boolean().optional(),
});
export type UpdateMemberRequestBody = z.infer<typeof updateMemberSchema>;

export const updateGameMembersSchema = z.object({
	userIds: OptionalEntitySchema,
});
export type UpdateGameMembersRequestBody = z.infer<typeof updateGameMembersSchema>;
