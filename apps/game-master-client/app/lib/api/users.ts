import type { Client } from ".";
import type { GetUserResponse } from "@repo/shared-types";

export class Users {
	constructor(private client: Client) {}

	async getUser(id: string): Promise<GetUserResponse> {
		return this.client.get<GetUserResponse>(`users/${id}`);
	}
}
