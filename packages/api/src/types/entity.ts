import type { Id, Visibility } from "./index.js"

export interface Entity {
	id: Id;
	name: string;
	content?: string | null;
	htmlContent?: string | null;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
	folderId?: Id | null;
	gameId: Id;
	visibility: Visibility;
	coverImageUrl?: string | null;
}
