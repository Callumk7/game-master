import type { Id } from "../types/index.js";

export interface Folder {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	parentFolderId?: Id | null;
	gameId: Id;
	ownerId: Id;
}
