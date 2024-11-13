import type { Client } from "../client.js";
import type {
	CreateFolderRequestBody,
	Folder,
	FolderWithChildren,
	UpdateFolderRequestBody,
} from "../types/folders.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";

export class Folders {
	constructor(private client: Client) {}

	async getFolderWithChildren(folderId: Id): Promise<FolderWithChildren> {
		return this.client.get<FolderWithChildren>(`folders/${folderId}`);
	}

	async createFolder(body: CreateFolderRequestBody): Promise<ServerResponse<Folder>> {
		return this.client.post<ServerResponse<Folder>>("folders", body);
	}

	async updateFolder(
		folderId: Id,
		body: UpdateFolderRequestBody,
	): Promise<ServerResponse<Folder>> {
		return this.client.patch<ServerResponse<Folder>>(`folders/${folderId}`, body);
	}

	async deleteFolder(folderId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`folders/${folderId}`);
	}

	async getGameFolders(gameId: Id) {
		return this.client.get<Folder[]>(`games/${gameId}/folders`);
	}
}
