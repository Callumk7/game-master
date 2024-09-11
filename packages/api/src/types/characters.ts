import type { Id } from "./index.js";

export interface Character {
	id: Id;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	isPlayer: boolean;
}
