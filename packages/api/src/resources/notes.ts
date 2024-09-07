import type { Client } from "../client.js";
import type { Id, ServerResponse } from "../types/index.js";
import type { CreateNoteRequestBody, Note } from "../types/notes.js";

export class Notes {
	constructor(private client: Client) {}

	// GET REQUESTS
	async getNote(id: string): Promise<Note> {
		return this.client.get<Note>(`notes/${id}`);
	}

	async getAllGameNotes(gameId: string): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/notes`);
	}

	async getUserNotesForGame(gameId: Id, userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/users/${userId}/notes`);
	}

	// POST REQUESTS
	async createNote(body: CreateNoteRequestBody): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>("notes", body);
	}
}
