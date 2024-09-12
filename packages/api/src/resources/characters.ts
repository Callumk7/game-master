import type { Client } from "../client.js";
import type { Character } from "../types/characters.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";

export class Characters {
	constructor(private client: Client) {}

	async getCharacter(charId: Id): Promise<Character> {
		return this.client.get<Character>(`characters/${charId}`);
	}

	async createCharacter(body: CreateCharacterBody): Promise<ServerResponse<Character>> {
		return this.client.post<ServerResponse<Character>>("characters", body);
	}

	async deleteCharacter(charId: Id): Promise<BasicServerResponse> {
		return this.client.delete(`characters/${charId}`);
	}

	async updateCharacterDetails(
		charId: Id,
		charDetails: Partial<Character>,
	): Promise<ServerResponse<Character>> {
		return this.client.patch<ServerResponse<Character>>(
			`characters/${charId}`,
			charDetails,
		);
	}

	async getAllGameCharacters(gameId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`games/${gameId}/characters`);
	}

	async getUserCharactersForGame(gameId: Id, userId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`games/${gameId}/users/${userId}/characters`);
	}

	async getAllUserCharacters(userId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`users/${userId}/characters`);
	}
}
