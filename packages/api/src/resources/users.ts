import type { Client } from "../client.js";
import type { ServerResponse } from "../types/index.js";
import type { User } from "../types/users.js";

export class Users {
	constructor(private client: Client) {}

	async getUser(id: string): Promise<ServerResponse<User>> {
		return this.client.get<ServerResponse<User>>(`users/${id}`);
	}
}
