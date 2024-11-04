import type { Client } from "../client.js";
import type {
	CreateGameRequestBody,
	Game,
	GameEntities,
	GameWithCharacters,
	GameWithDatedEntities,
	GameWithMembers,
	GameWithNotes,
	UpdateGameRequestBody,
	UpdateMemberRequestBody,
} from "../types/games.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";
import type { Note } from "../types/notes.js";
import type { GameMember, User } from "../types/users.js";

export class Games {
	constructor(private client: Client) {}

	getGame = Object.assign(
		async (gameId: Id) => {
			return this.client.get<Game>(`games/${gameId}`);
		},
		{
			withMembers: async (gameId: Id) => {
				return this.getGameWithMembers(gameId);
			},
		},
		{
			withData: async (gameId: Id) => {
				return this.getGameWithData(gameId);
			},
		},
	);

	async getGameWithMembers(gameId: Id) {
		return this.client.get<GameWithMembers>(`games/${gameId}`, {
			searchParams: { dataLevel: "withMembers" },
		});
	}

	async getGameWithData(gameId: Id) {
		return this.client.get<GameWithDatedEntities>(`games/${gameId}`, {
			searchParams: { dataLevel: "withData" },
		});
	}

	async deleteGame(gameId: string): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`games/${gameId}`);
	}

	async updateGameDetails(
		gameId: string,
		gameDetails: UpdateGameRequestBody,
	): Promise<ServerResponse<Game>> {
		return this.client.patch<ServerResponse<Game>>(`games/${gameId}`, gameDetails);
	}

	async getAllUsersGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games`);
	}

	async getAllGameEntities(gameId: Id): Promise<GameEntities> {
		return this.client.get<GameEntities>(`games/${gameId}/entities`);
	}

	async getGameNotes(gameId: Id): Promise<GameWithNotes> {
		return this.client.get<GameWithNotes>(`games/${gameId}/notes`);
	}

	async getGameMembers(gameId: Id): Promise<User[]> {
		return this.client.get<User[]>(`games/${gameId}/members`);
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

	async addMember(
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

	async removeMember(gameId: Id, userId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(
			`games/${gameId}/members/${userId}`,
		);
	}

	async updateMembers(
		gameId: Id,
		userIds: Id[],
	): Promise<ServerResponse<{ gameId: Id; userIds: Id[] }>> {
		return this.client.put<ServerResponse<{ gameId: Id; userIds: Id[] }>>(
			`games/${gameId}/members`,
			{ userIds },
		);
	}

	async editMember(
		gameId: Id,
		userId: Id,
		update: UpdateMemberRequestBody,
	): Promise<ServerResponse<GameMember>> {
		return this.client.patch<ServerResponse<GameMember>>(
			`games/${gameId}/members/${userId}`,
			update,
		);
	}
}
