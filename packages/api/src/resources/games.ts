import type { Client } from "../client.js";
import type { CreateGameRequestBody, Game } from "../types/games.js";
import type { ServerResponse } from "../types/index.js";

export class Games {
	constructor(private client: Client) {}

	async getGame(id: string): Promise<Game> {
		return this.client.get<Game>(`games/${id}`);
	}

	async getOwnedGames(userId: string): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games/owned`);
	}

	async createGame(input: CreateGameRequestBody): Promise<ServerResponse<Game>> {
		return this.client.post<ServerResponse<Game>>("games", input);
	}
}
