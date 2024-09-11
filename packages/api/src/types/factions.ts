import type { Character } from "./characters.js";
import type { Id } from "./index.js";

export interface Faction {
	id: Id;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}

export interface FactionWithMembers extends Faction {
	members: Character[];
}
