import type { Client } from "../client.js";
import type { Character } from "../types/characters.js";
import type { Faction } from "../types/factions.js";
import type { BasicServerResponse, Id, ServerResponse } from "../types/index.js";
import type { CreateNoteRequestBody, Note } from "../types/notes.js";

export class Notes {
	constructor(private client: Client) { }

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

	// DONE
	async getLinkedNotes(
		noteId: Id,
	): Promise<{ backLinks: Note[]; outgoingLinks: Note[] }> {
		return this.client.get<{ backLinks: Note[]; outgoingLinks: Note[] }>(
			`notes/${noteId}/links/notes`,
		);
	}

	// DONE
	async linkNotes(
		fromId: Id,
		toIds: Id[],
	): Promise<ServerResponse<{ fromId: Id; toIds: Id[] }>> {
		return this.client.post<ServerResponse<{ fromId: Id; toIds: Id[] }>>(
			`notes/${fromId}/links/notes`,
			{
				toIds,
			},
		);
	}

	async getLinkedCharacters(
		noteId: Id,
	): Promise<Character[]> {
		return this.client.get<Character[]>(
			`notes/${noteId}/links/characters`,
		);
	}

	async linkCharacters(
		noteId: Id,
		characterIds: Id[],
	): Promise<ServerResponse<{ characterIds: Id[] }>> {
		return this.client.post<ServerResponse<{ characterIds: Id[] }>>(
			`notes/${noteId}/links/characters`,
			{
				characterIds,
			},
		);
	}

	async getLinkedFactions(
		noteId: Id,
	): Promise<Faction[]> {
		return this.client.get<Faction[]>(
			`notes/${noteId}/links/factions`,
		);
	}

	async linkFactions(
		noteId: Id,
		factionIds: Id[],
	): Promise<ServerResponse<{ factionIds: Id[] }>> {
		return this.client.post<ServerResponse<{ factionIds: Id[] }>>(
			`notes/${noteId}/links/factions`,
			{
				factionIds,
			},
		);
	}

	async updateLinkedCharacters(
		noteId: Id,
		characterIds: Id[],
	): Promise<ServerResponse<{ characterIds: Id[] }>> {
		return this.client.put<ServerResponse<{ characterIds: Id[] }>>(
			`notes/${noteId}/links/characters`,
			{
				characterIds,
			},
		);
	}

	async updateLinkedFactions(
		noteId: Id,
		factionIds: Id[],
	): Promise<ServerResponse<{ factionIds: Id[] }>> {
		return this.client.put<ServerResponse<{ factionIds: Id[] }>>(
			`notes/${noteId}/links/factions`,
			{
				factionIds,
			},
		);
	}
}
