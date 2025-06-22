import type { Client } from "../client.js";
import type { Game, GameWithEntities } from "../types/games.js";
import type { Id, QueryOptions, ServerResponse } from "../types/index.js";
import type { UpdateUserRequestBody, User, UserWithSidebarData } from "../types/users.js";

export class Users {
	constructor(private client: Client) {}

	games = Object.assign(
		async (userId: Id) => {
			return this.client.get<Game[]>(`users/${userId}/games`);
		},
		{
			withItems: async (userId: Id) => {
				return this.client.get<GameWithEntities[]>(
					`users/${userId}/games/items`,
					{
						searchParams: { with: "entities" },
					},
				);
			},
		},
	);

	async getUserWithSidebarData(userId: Id): Promise<UserWithSidebarData> {
		return this.client.get<UserWithSidebarData>(`users/${userId}/sidebar`);
	}

	async update(userId: Id, body: UpdateUserRequestBody) {
		return this.client.patch<ServerResponse<User>>(`users/${userId}`, body);
	}
}
