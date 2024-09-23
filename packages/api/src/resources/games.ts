import type { Client } from "../client.js";
import type {
	CreateGameRequestBody,
	Game,
	GameEntities,
	GameWithCharacters,
	GameWithData,
	GameWithNestedData,
	GameWithNotes,
} from "../types/games.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";
import type { Note } from "../types/notes.js";

export class Games {
	constructor(private client: Client) {}

	async getGame(gameId: Id): Promise<Game> {
		return this.client.get<Game>(`games/${gameId}`);
	}

	async deleteGame(gameId: string): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`games/${gameId}`);
	}

	async updateGameDetails(
		gameId: string,
		gameDetails: Partial<Game>,
	): Promise<ServerResponse<Game>> {
		return this.client.patch<ServerResponse<Game>>(`games/${gameId}`, gameDetails);
	}

	async getAllUsersGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games`);
	}

	async getOwnedGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games?owned=true`);
	}

	async getAllGameData(gameId: Id): Promise<GameWithData> {
		return this.client.get<GameWithData>(`games/${gameId}/all`);
	}

	async getAllGameEntities(gameId: Id): Promise<GameEntities> {
		return this.client.get<GameEntities>(`games/${gameId}/entities`);
	}

	async getAllGameDataWithNestedRelations(gameId: Id): Promise<GameWithNestedData> {
		return this.client.get<GameWithNestedData>(`games/${gameId}/all?nested=true`)
	}

	async getGameNotes(gameId: Id): Promise<GameWithNotes> {
		return this.client.get<GameWithNotes>(`games/${gameId}/notes`);
	}

	async getGameMembersNotes(gameId: Id, userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/members/${userId}/notes`);
	}

	async getGameCharacters(gameId: Id): Promise<GameWithCharacters> {
		return this.client.get<GameWithCharacters>(`games/${gameId}/characters`);
	}

	async createGame(input: CreateGameRequestBody): Promise<ServerResponse<Game>> {
		return this.client.post<ServerResponse<Game>>("games", input);
	}

	async joinGame(
		gameId: Id,
		userId: Id,
	): Promise<ServerResponse<{ userId: Id; gameId: Id }>> {
		return this.client.post<ServerResponse<{ userId: Id; gameId: Id }>>(
			`games/${gameId}/members`,
			{
				userId,
			},
		);
	}

	async leaveGame(gameId: Id, userId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(
			`games/${gameId}/members/${userId}`,
		);
	}
}
