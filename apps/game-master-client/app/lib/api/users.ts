import type { User } from "types/users";
import type { Client } from ".";

export class Users {
	constructor(private client: Client) {}

	async getUser(id: string): Promise<User> {
		return this.client.get<User>(`users/${id}`);
	}
}
