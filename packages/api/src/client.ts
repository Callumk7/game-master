import ky, { type Options } from "ky";
import { Characters } from "./resources/characters.js";
import { Factions } from "./resources/factions.js";
import { Folders } from "./resources/folders.js";
import { Games } from "./resources/games.js";
import { Notes } from "./resources/notes.js";
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

	async postImage<T>(
		url: string,
		uploadStream: ReadableStream<Uint8Array>,
		options?: Options,
	): Promise<T> {
		return this.ky
			.post(url, {
				body: uploadStream,
				...options,
			})
			.json<T>();
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
	factions: Factions;
	folders: Folders;

	constructor(options: ClientOptions) {
		this.client = new Client(options);
		this.games = new Games(this.client);
		this.users = new Users(this.client);
		this.notes = new Notes(this.client);
		this.characters = new Characters(this.client);
		this.factions = new Factions(this.client);
		this.folders = new Folders(this.client);
	}
}
