import { Note } from "@repo/shared-types";
import { Client } from ".";

export class Notes {
	constructor(private client: Client) {}

	async getNote(id: string): Promise<Note> {
		return this.client.get<Note>(`notes/${id}`);
	}

	async getAllGameNotes(gameId: string): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/notes`);
	}

	async getUserNotesForGame(gameId: string, userId: string): Promise<Note[]> {
		return this.client.get<Note[]>(`games/${gameId}/users/${userId}/notes`)
	}
}
