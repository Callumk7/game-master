import type { Client } from "../client.js";
import type { Game, GameWithData, GameWithNestedData } from "../types/games.js";
import type { Id, QueryOptions } from "../types/index.js";
import type { Note } from "../types/notes.js";
import type { User, UserWithSidebarData } from "../types/users.js";

export class Users {
	constructor(private client: Client) { }

	async getUser(id: string): Promise<User> {
		return this.client.get<User>(`users/${id}`);
	}

	async getAllUsers(options?: QueryOptions): Promise<User[]> {
		const searchParams: Record<string, number> = {};

		if (options?.limit) searchParams.limit = options.limit;
		if (options?.offset) searchParams.offset = options.offset;

		return this.client.get<User[]>("users", {
			searchParams: Object.keys(searchParams).length ? searchParams : undefined,
		});
	}

	// DONE
	async getAllUserGamesWithSidebarData(userId: Id): Promise<UserWithSidebarData> {
		return this.client.get<UserWithSidebarData>(`users/${userId}/games`, {
			searchParams: { withData: "sidebar" },
		});
	}

	// DONE
	async getAllUserData(userId: Id): Promise<GameWithData[]> {
		return this.client.get<GameWithData[]>(`users/${userId}/games`, {
			searchParams: { withData: "flat" },
		});
	}

	// NOTE: I am not sure if this is required, I think we have a more granular
	// way of handling this.
	async getAllUserDataWithNestedRelations(userId: Id): Promise<GameWithNestedData[]> {
		return this.client.get<GameWithNestedData[]>(`users/${userId}/games`, {
			searchParams: { withData: "nested" },
		});
	}

	async getAllUsersGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games`);
	}

	async getAllUsersNotes(userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`users/${userId}/notes`);
	}
}
