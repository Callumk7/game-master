import ky, { type Options } from "ky";
import { Games } from "./resources/games.js";
import { Users } from "./resources/users.js";

export interface ClientOptions {
	baseUrl: string;
	apiKey: string;
}

export class Client {
	private ky: typeof ky;

	constructor(options: ClientOptions) {
		this.ky = ky.extend({
			prefixUrl: options.baseUrl,
			headers: {
				Authorization: `Bearer ${options.apiKey}`,
				"Content-Type": "application/json",
			},
			hooks: {
				beforeError: [
					(error) => {
						const { response } = error;
						if (response?.body) {
							error.name = "ApiError";
							error.message = `${response.status} ${response.statusText}`;
						}
						return error;
					},
				],
			},
		});
	}

	// TODO: Add runtime type checking with zod to api calls

	async get<T>(url: string, options?: Options): Promise<T> {
		return this.ky.get(url, options).json<T>();
	}

	async post<T>(url: string, data: unknown, options?: Options): Promise<T> {
		return this.ky.post(url, { json: data, ...options }).json<T>();
	}

	async put<T>(url: string, data: unknown, options?: Options): Promise<T> {
		return this.ky.put(url, { json: data, ...options }).json<T>();
	}

	async delete<T>(url: string, options?: Options): Promise<T> {
		return this.ky.delete(url, options).json<T>();
	}
}

export class SDK {
	private client: Client;
	users: Users;
	games: Games;

	constructor(options: ClientOptions) {
		this.client = new Client(options);
		this.games = new Games(this.client);
		this.users = new Users(this.client);
	}
}
