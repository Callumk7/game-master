import type { Client } from "../client.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";
import type { CreateNoteRequestBody, Note } from "../types/notes.js";

export class Notes {
	constructor(private client: Client) {}

	// DONE
	async getNote(noteId: Id): Promise<Note> {
		return this.client.get<Note>(`notes/${noteId}`);
	}

	// DONE
	async createNote(body: CreateNoteRequestBody): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>("notes", body);
	}

	// DONE
	async deleteNote(noteId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`notes/${noteId}`);
	}

	// DONE
	async updateNote(
		noteId: Id,
		noteDetails: Partial<Note>,
	): Promise<ServerResponse<Note>> {
		return this.client.patch<ServerResponse<Note>>(`notes/${noteId}`, noteDetails);
	}

	// PARTIALLY DONE
	async duplicateNote(
		noteId: Id,
		newNoteDetails: Partial<Note>,
	): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>(
			`notes/${noteId}/duplicate`,
			newNoteDetails,
		);
	}

	// DONE
	async getAllGameNotes(gameId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/notes`);
	}

	// DONE
	async getUserNotesForGame(gameId: Id, userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/users/${userId}/notes`);
	}

	// DONE
	async getAllUserNotes(userId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`users/${userId}/notes`);
	}

	async linkNotes(fromId: Id, toIds: Id[]): Promise<{ fromId: Id; toIds: Id[] }> {
		return this.client.post<{ fromId: Id; toIds: Id[] }>(`notes/${fromId}/links`, {
			toIds,
		});
	}
}


