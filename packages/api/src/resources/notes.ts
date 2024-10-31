import type { Client } from "../client.js";
import type { Character } from "../types/characters.js";
import type { Faction } from "../types/factions.js";
import type { FolderInteractionRequestBody } from "../types/folders.js";
import type { Image } from "../types/images.js";
import type {
	BasicServerResponse,
	CreatePermissionRequestBody,
	Id,
	Permission,
	ServerResponse,
} from "../types/index.js";
import type {
	CreateNoteRequestBody,
	DuplicateNoteRequestBody,
	Note,
	NoteWithPermissions,
	UpdateNoteContentRequestBody,
} from "../types/notes.js";

export class Notes {
	constructor(private client: Client) {}

	// DONE
	async getNote(noteId: Id): Promise<Note> {
		return this.client.get<Note>(`notes/${noteId}`);
	}

	async getNoteWithPermissions(noteId: Id): Promise<NoteWithPermissions> {
		return this.client.get<NoteWithPermissions>(`notes/${noteId}/permissions`);
	}

	// DONE
	async createNote(body: CreateNoteRequestBody): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>("notes", body);
	}

	async createNotePermission(
		noteId: Id,
		body: CreatePermissionRequestBody,
	): Promise<ServerResponse<Permission>> {
		return this.client.post<ServerResponse<Permission>>(
			`notes/${noteId}/permissions`,
			body,
		);
	}

	// DONE
	async deleteNote(noteId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`notes/${noteId}`);
	}

	// DONE
	async updateNote(
		noteId: Id,
		noteDetails: UpdateNoteContentRequestBody,
	): Promise<ServerResponse<Note>> {
		return this.client.patch<ServerResponse<Note>>(`notes/${noteId}`, noteDetails);
	}

	// PARTIALLY DONE
	async duplicateNote(
		noteId: Id,
		newNoteDetails: DuplicateNoteRequestBody,
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

	async getLinkedCharacters(noteId: Id): Promise<Character[]> {
		return this.client.get<Character[]>(`notes/${noteId}/links/characters`);
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

	async getLinkedFactions(noteId: Id): Promise<Faction[]> {
		return this.client.get<Faction[]>(`notes/${noteId}/links/factions`);
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

	async moveToFolder(noteId: Id, folderId: Id): Promise<BasicServerResponse> {
		const body: FolderInteractionRequestBody = { entityId: noteId };
		return this.client.post<BasicServerResponse>(`folders/${folderId}/notes`, body);
	}

	async uploadImage(
		noteId: Id,
		uploadStream: ReadableStream<Uint8Array>,
		contentType: string,
	): Promise<ServerResponse<Image>> {
		return this.client.postImage<ServerResponse<Image>>(
			`notes/${noteId}/images`,
			uploadStream,
			{
				headers: {
					"Content-Type": contentType,
				},
			},
		);
	}
}
