import type { Client } from "../client.js";
import type { Character, CharacterWithFaction } from "../types/characters.js";
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
import type { Methods } from "./methods.js";

export class Games {
	constructor(
		private client: Client,
		private methods: Methods,
	) {}

	async create(input: CreateGameRequestBody): Promise<ServerResponse<Game>> {
		return this.client.post<ServerResponse<Game>>("games", input);
	}

	async update(
		gameId: string,
		gameDetails: UpdateGameRequestBody,
	): Promise<ServerResponse<Game>> {
		return this.client.patch<ServerResponse<Game>>(`games/${gameId}`, gameDetails);
	}

	async delete(gameId: string): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`games/${gameId}`);
	}

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

	characters = Object.assign(
		async (gameId: Id) => {
			return this.methods.getGameCharacters(gameId);
		},
		{
			withPrimaryFaction: async (gameId: Id) => {
				return this.client.get<CharacterWithFaction[]>(
					`games/${gameId}/characters`,
					{
						searchParams: { withData: "primaryFaction" },
					},
				);
			},
		},
	);

	factions = Object.assign(
		async (gameId: Id) => {
			return this.methods.getGameFactions(gameId);
		},
		{
			withMembers: async (gameId: Id) => {
				return this.methods.getGameFactionsWithMembers(gameId);
			},
		},
	);

	async notes(gameId: Id) {
		return this.methods.getGameNotes(gameId);
	}

	async getAllGameEntities(gameId: Id): Promise<GameEntities> {
		return this.client.get<GameEntities>(`games/${gameId}/entities`);
	}

	async getGameMembers(gameId: Id): Promise<User[]> {
		return this.client.get<User[]>(`games/${gameId}/members`);
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

	private async getGameWithMembers(gameId: Id) {
		return this.client.get<GameWithMembers>(`games/${gameId}`, {
			searchParams: { dataLevel: "withMembers" },
		});
	}

	private async getGameWithData(gameId: Id) {
		return this.client.get<GameWithDatedEntities>(`games/${gameId}`, {
			searchParams: { dataLevel: "withData" },
		});
	}
}
