import type { Client } from "../client.js";
import type {
	Character,
	CharacterWithNotes,
	CharacterWithPermissions,
	CreateCharacterRequestBody,
	DuplicateCharacterRequestBody,
	UpdateCharacterRequestBody,
} from "../types/characters.js";
import type { FolderInteractionRequestBody } from "../types/folders.js";
import type {
	BasicServerResponse,
	CreatePermissionRequestBody,
	Id,
	Permission,
	ServerResponse,
} from "../types/index.js";

export class Characters {
	constructor(private client: Client) { }

	// DONE
	async getCharacter(charId: Id): Promise<Character> {
		return this.client.get<Character>(`characters/${charId}`);
	}

	async getCharacterWithPermissions(charId: Id): Promise<CharacterWithPermissions> {
		return this.client.get<CharacterWithPermissions>(
			`characters/${charId}/permissions`,
		);
	}

	// DONE
	async createCharacter(
		body: CreateCharacterRequestBody,
	): Promise<ServerResponse<Character>> {
		return this.client.post<ServerResponse<Character>>("characters", body);
	}

	// DONE
	async deleteCharacter(charId: Id): Promise<BasicServerResponse> {
		return this.client.delete(`characters/${charId}`);
	}

	// DONE
	async duplicateCharacter(
		charId: Id,
		duplicateData: DuplicateCharacterRequestBody,
	): Promise<ServerResponse<Character>> {
		return this.client.post<ServerResponse<Character>>(
			`characters/${charId}/duplicate`,
			duplicateData,
		);
	}

	async createCharacterPermission(
		charId: Id,
		body: CreatePermissionRequestBody,
	): Promise<ServerResponse<Permission>> {
		return this.client.post<ServerResponse<Permission>>(
			`characters/${charId}/permissions`,
			body,
		);
	}

	// DONE
	async updateCharacterDetails(
		charId: Id,
		charDetails: UpdateCharacterRequestBody,
	): Promise<ServerResponse<Character>> {
		return this.client.patch<ServerResponse<Character>>(
			`characters/${charId}`,
			charDetails,
		);
	}

	// DONE
	async getAllGameCharacters(gameId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`games/${gameId}/characters`);
	}

	// DONE
	async getUserCharactersForGame(gameId: Id, userId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`games/${gameId}/users/${userId}/characters`);
	}

	// DONE
	async getAllUserCharacters(userId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`users/${userId}/characters`);
	}

	// DONE
	async getCharacterWithNotes(charId: Id): Promise<CharacterWithNotes> {
		return this.client.get<CharacterWithNotes>(`characters/${charId}/notes`);
	}

	async moveToFolder(charId: Id, folderId: Id): Promise<BasicServerResponse> {
		const body: FolderInteractionRequestBody = { entityId: charId };
		return this.client.post<BasicServerResponse>(`folders/${folderId}/notes`, body);
	}
}
