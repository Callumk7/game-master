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
import type { Methods } from "./methods.js";

export class Notes {
	constructor(
		private client: Client,
		private methods: Methods,
	) {}

	getNote = Object.assign(
		async (noteId: Id) => {
			return this.client.get<Note>(`notes/${noteId}`);
		},
		{
			withPermissions: async (noteId: Id) => {
				return this.client.get<NoteWithPermissions>(
					`notes/${noteId}/permissions`,
				);
			},
		},
	);

	create = Object.assign(
		async (body: CreateNoteRequestBody) => {
			return this.client.post<ServerResponse<Note>>("notes", body);
		},
		{
			permission: async (noteId: Id, body: CreatePermissionRequestBody) => {
				return this.client.post<ServerResponse<Permission>>(
					`notes/${noteId}/permissions`,
					body,
				);
			},
		},
	);

	async delete(noteId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(`notes/${noteId}`);
	}

	async update(
		noteId: Id,
		noteDetails: UpdateNoteContentRequestBody,
	): Promise<ServerResponse<Note>> {
		return this.client.patch<ServerResponse<Note>>(`notes/${noteId}`, noteDetails);
	}

	async duplicate(
		noteId: Id,
		newNoteDetails: DuplicateNoteRequestBody,
	): Promise<ServerResponse<Note>> {
		return this.client.post<ServerResponse<Note>>(
			`notes/${noteId}/duplicate`,
			newNoteDetails,
		);
	}

	async forGame(gameId: Id) {
		return this.methods.getGameNotes(gameId);
	}

	// DONE
	async getLinkedNotes(
		noteId: Id,
	): Promise<{ backLinks: Note[]; outgoingLinks: Note[] }> {
		return this.client.get<{ backLinks: Note[]; outgoingLinks: Note[] }>(
			`notes/${noteId}/links/notes`,
		);
	}

	link = Object.assign(
		async (fromId: Id, toIds: Id[]) => {
			return this.linkNotes(fromId, toIds);
		},
		{
			characters: async (noteId: Id, charIds: Id[]) => {
				return this.linkCharacters(noteId, charIds);
			},
			factions: async (noteId: Id, factionIds: Id[]) => {
				return this.linkFactions(noteId, factionIds);
			},
			update: {
				characters: async (noteId: Id, charIds: Id[]) => {
					return this.updateLinkedCharacters(noteId, charIds);
				},
				factions: async (noteId: Id, factionIds: Id[]) => {
					return this.updateLinkedFactions(noteId, factionIds);
				},
				notes: async (fromId: Id, toIds: Id[]) => {
					return this.updateLinkedNotes(fromId, toIds);
				},
			},
		},
	);

	async linkNotes(fromId: Id, noteIds: Id[]) {
		return this.client.post<ServerResponse<{ fromId: Id; toIds: Id[] }>>(
			`notes/${fromId}/links/notes`,
			{
				noteIds,
			},
		);
	}

	async updateLinkedNotes(fromId: Id, noteIds: Id[]) {
		return this.client.put<ServerResponse<{ fromId: Id; toIds: Id[] }>>(
			`notes/${fromId}/links/notes`,
			{ noteIds },
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

	images = {
		upload: async (
			noteId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.uploadImage(noteId, uploadStream, contentType);
		},

		updateCover: async (
			noteId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.client.postImage<ServerResponse<Note>>(
				`notes/${noteId}/cover`,
				uploadStream,
				{
					headers: {
						"Content-Type": contentType,
					},
				},
			);
		},
	};

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
