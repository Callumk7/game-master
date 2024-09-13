import type { Id } from "../types/index.js";
import type { Client } from "../client.js";
import type { User } from "../types/users.js";
import type { Game, GameWithData } from "../types/games.js";
import type { Note } from "../types/notes.js";

export class Users {
	constructor(private client: Client) {}

	async getUser(id: string): Promise<User> {
		return this.client.get<User>(`users/${id}`);
	}

	async getOwnedGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games`, {
			searchParams: { owned: "true" }
		});
	}

	async getAllUserData(userId: Id): Promise<GameWithData[]> {
		return this.client.get<GameWithData[]>(`users/${userId}/games`, {
			searchParams: { withData: "true" },
		});
	}

	async getAllUsersGames(userId: Id): Promise<Game[]> {
		return this.client.get<Game[]>(`users/${userId}/games`);
	}

	async getAllUsersNotes(userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`users/${userId}/notes`);
	}

}
