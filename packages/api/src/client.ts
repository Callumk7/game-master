import ky, { type Options } from "ky";
import { DatabaseError } from "./error.js";
import { Characters } from "./resources/characters.js";
import { Factions } from "./resources/factions.js";
import { Folders } from "./resources/folders.js";
import { Games } from "./resources/games.js";
import { Methods } from "./resources/methods.js";
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
						
						if (response.status === 401) {
							throw new AuthenticationError();
						}
						
						if (response.status === 404) {
							throw new NotFoundError(response.statusText);
						}
						
						if (response.statusText === "Database Error") {
							throw new DatabaseError();
						}
						
						if (response.status === 400) {
							throw new ValidationError(response.statusText);
						}

						throw new ApiError(
							response.statusText || 'Unknown error occurred',
							response.status
						);
					},
				],
			},
		});
	}

	async get<T>(url: string, options?: Options): Promise<T> {
		try {
			return this.ky.get(url, options).json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	async post<T>(url: string, data: unknown, options?: Options): Promise<T> {
		try {
			return this.ky.post(url, { json: data, ...options }).json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	async postImage<T>(
		url: string,
		uploadStream: ReadableStream<Uint8Array>,
		options?: Options,
	): Promise<T> {
		try {
			return this.ky
				.post(url, {
					body: uploadStream,
					...options,
				})
				.json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	async put<T>(url: string, data: unknown, options?: Options): Promise<T> {
		try {
			return this.ky.put(url, { json: data, ...options }).json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	async patch<T>(url: string, data: unknown, options?: Options): Promise<T> {
		try {
			return this.ky.patch(url, { json: data, ...options }).json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	async delete<T>(url: string, options?: Options): Promise<T> {
		try {
			return this.ky.delete(url, options).json<T>();
		} catch (error) {
			this.handleError(error);
		}
	}

	private handleError(error: unknown): never {
		if (error instanceof DatabaseError) {
			throw error;
		}

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("An unknown error occurred");
	}
}

export class SDK {
	private client: Client;
	private methods: Methods;
	users: Users;
	games: Games;
	notes: Notes;
	characters: Characters;
	factions: Factions;
	folders: Folders;

	constructor(options: ClientOptions) {
		this.client = new Client(options);
		this.methods = new Methods(this.client);
		this.users = new Users(this.client);
		this.games = new Games(this.client, this.methods);
		this.notes = new Notes(this.client, this.methods);
		this.characters = new Characters(this.client, this.methods);
		this.factions = new Factions(this.client, this.methods);
		this.folders = new Folders(this.client);
	}
}
