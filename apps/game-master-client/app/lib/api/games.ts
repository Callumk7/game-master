import type { CreateGameInput, Game } from "types/games";
import type { Client } from ".";

export class Games {
	constructor(private client: Client) {}

	async getGame(id: string): Promise<Game> {
		return this.client.get<Game>(`games/${id}`);
	}

	async getOwnedGames(userId: string): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games/owned`);
	}

	async createGame(input: CreateGameInput): Promise<Game> {
		return this.client.post<Game>("games", input);
	}
}
