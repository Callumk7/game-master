import type { Client } from "../client.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";
import type { CreateNoteRequestBody, Note } from "../types/notes.js";

export class Notes {
	constructor(private client: Client) {}

	async getNote(noteId: Id): Promise<Note> {
		return this.client.get<Note>(`notes/${noteId}`);
	}

	async createNote(body: CreateNoteRequestBody): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>("notes", body);
	}

	async deleteNote(noteId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`notes/${noteId}`);
	}

	async updateNote(
		noteId: Id,
		noteDetails: Partial<Note>,
	): Promise<ServerResponse<Note>> {
		return this.client.patch<ServerResponse<Note>>(`notes/${noteId}`, noteDetails);
	}

	async duplicateNote(
		noteId: Id,
		newNoteDetails: Partial<Note>,
	): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>(
			`notes/${noteId}/duplicate`,
			newNoteDetails,
		);
	}

	async getAllGameNotes(gameId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/notes`);
	}

	async getUserNotesForGame(gameId: Id, userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/users/${userId}/notes`);
	}

	async getAllUserNotes(userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`users/${userId}/notes`);
	}

	async linkNotes(fromId: Id, toIds: Id[]): Promise<{ fromId: Id; toIds: Id[] }> {
		return this.client.post<{ fromId: Id; toIds: Id[] }>(`notes/${fromId}/links`, {
			toIds,
		});
	}
}
