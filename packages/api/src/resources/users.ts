import type { Client } from "../client.js";
import type { Game, GameWithEntities } from "../types/games.js";
import type { Id, QueryOptions } from "../types/index.js";
import type { Note } from "../types/notes.js";
import type { User, UserWithSidebarData } from "../types/users.js";

export class Users {
	constructor(private client: Client) {}

	getUser = Object.assign(async (userId: Id) => {
		return this.client.get<User>(`users/${userId}`);
	});

	games = Object.assign(
		async (userId: Id) => {
			return this.client.get<Game[]>(`users/${userId}/games`);
		},
		{
			items: async (userId: Id) => {
				return this.client.get<GameWithEntities[]>(
					`users/${userId}/games/items`,
					{
						searchParams: { with: "entities" },
					},
				);
			},
		},
	);

	async getAllUsers(options?: QueryOptions): Promise<User[]> {
		const searchParams: Record<string, number> = {};

		if (options?.limit) searchParams.limit = options.limit;
		if (options?.offset) searchParams.offset = options.offset;

		return this.client.get<User[]>("users", {
			searchParams: Object.keys(searchParams).length ? searchParams : undefined,
		});
	}

	async getUserSidebarData(userId: Id): Promise<UserWithSidebarData> {
		return this.client.get<UserWithSidebarData>(`users/${userId}/sidebar`);
	}

	async getAllUsersNotes(userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`users/${userId}/notes`);
	}
}
