import ky, { type Options } from "ky";
import { Games } from "./resources/games.js";
import { Users } from "./resources/users.js";
import { Notes } from "./resources/notes.js";
import { Characters } from "./resources/characters.js";

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
				beforeRequest: [
					(request) => {
						console.log(`Making request to: ${request.url}`);
					},
				],
				afterResponse: [
					(request, options, response) => {
						console.log(
							`Received response from: ${request.url}, status: ${response.status}`,
						);
					},
				],
				beforeError: [
					(error) => {
						error.name = "ApiError";
						if (error.response) {
							error.message = `${error.response.status} ${error.response.statusText}`;
						} else {
							error.message = `Network error: ${error.message}`;
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

	async patch<T>(url: string, data: unknown, options?: Options): Promise<T> {
		return this.ky.patch(url, { json: data, ...options }).json<T>();
	}

	async delete<T>(url: string, options?: Options): Promise<T> {
		return this.ky.delete(url, options).json<T>();
	}
}

export class SDK {
	private client: Client;
	users: Users;
	games: Games;
	notes: Notes;
	characters: Characters;

	constructor(options: ClientOptions) {
		this.client = new Client(options);
		this.games = new Games(this.client);
		this.users = new Users(this.client);
		this.notes = new Notes(this.client);
		this.characters = new Characters(this.client);
	}
}
