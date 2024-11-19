import { z } from "zod";
import type { GameWithDatedEntities } from "./games.js";
import type { Id } from "./index.js";

export interface User {
	id: Id;
	firstName: string | null;
	lastName: string | null;
	username: string;
	email: string;
}

export const roleSchema = z.enum(["admin", "dm", "player", "guest"]);
export type Role = z.infer<typeof roleSchema>;

export interface GameMember extends User {
	role: Role;
	isOwner: boolean;
}

export interface UserWithSidebarData extends User {
	games: GameWithDatedEntities[];
}

export const newUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	username: z.string(),
	email: z.string().email(),
	passwordHash: z.string(),
});
export type NewUserRequestBody = z.infer<typeof newUserSchema>;

export const baseUserSchema = z.object({
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
});
export type UpdateUserRequestBody = z.infer<typeof baseUserSchema>;

