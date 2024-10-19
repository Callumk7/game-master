import type { Id } from "./index.js";

export interface Image {
	id: Id;
	ownerId: Id;
	noteId?: Id | null;
	characterId?: Id | null;
	factionId?: Id | null;
	imageUrl: string;
}
