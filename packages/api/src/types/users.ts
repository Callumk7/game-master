import { z } from "zod";
import type { Id } from "./index.js";
import type { GameWithDatedEntities } from "./games.js";

export interface User {
	id: Id;
	firstName: string | null;
	lastName: string | null;
	username: string;
	email: string;
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

