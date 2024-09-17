import type { Client } from "../client.js";
import type { Character, CharacterWithNotes, CreateCharacterRequestBody } from "../types/characters.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";

export class Characters {
	constructor(private client: Client) {}

	// DONE
	async getCharacter(charId: Id): Promise<Character> {
		return this.client.get<Character>(`characters/${charId}`);
	}

	// DONE
	async createCharacter(body: CreateCharacterRequestBody): Promise<ServerResponse<Character>> {
		return this.client.post<ServerResponse<Character>>("characters", body);
	}

	// DONE
	async deleteCharacter(charId: Id): Promise<BasicServerResponse> {
		return this.client.delete(`characters/${charId}`);
	}

	// TODO: change the Partial type to an inferred type based on the updateCharacter zod schema
	async updateCharacterDetails(
		charId: Id,
		charDetails: Partial<Character>,
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

	async getCharacterWithNotes(charId: Id): Promise<CharacterWithNotes> {
		return this.client.get<CharacterWithNotes>(`characters/${charId}/notes`)
	}
}
