import type { Client } from "../client.js";
import type {
	Character,
	CharacterWithPermissions,
	CreateCharacterRequestBody,
	DuplicateCharacterRequestBody,
	UpdateCharacterRequestBody,
} from "../types/characters.js";
import type { FactionWithMembers } from "../types/factions.js";
import type { FolderInteractionRequestBody } from "../types/folders.js";
import type { Image } from "../types/images.js";
import type {
	BasicServerResponse,
	CreatePermissionRequestBody,
	Id,
	Permission,
	ServerResponse,
} from "../types/index.js";
import type { Methods } from "./methods.js";

export class Characters {
	constructor(
		private client: Client,
		private methods: Methods,
	) {}

	create = Object.assign(
		async (body: CreateCharacterRequestBody) => {
			return this.client.post<ServerResponse<Character>>("characters", body);
		},
		{
			permission: (charId: Id, body: CreatePermissionRequestBody) => {
				return this.createCharacterPermission(charId, body);
			},
		},
	);

	async update(charId: Id, charDetails: UpdateCharacterRequestBody) {
		return this.client.patch<ServerResponse<Character>>(
			`characters/${charId}`,
			charDetails,
		);
	}

	async delete(charId: Id) {
		return this.client.delete<BasicServerResponse>(`characters/${charId}`);
	}

	async duplicate(charId: Id, duplicateData: DuplicateCharacterRequestBody) {
		return this.client.post<ServerResponse<Character>>(
			`characters/${charId}/duplicate`,
			duplicateData,
		);
	}

	getCharacter = Object.assign(
		async (charId: Id) => {
			return this.client.get<Character>(`characters/${charId}`);
		},
		{
			withPermissions: async (charId: Id) => {
				return this.getCharacterWithPermissions(charId);
			},
		},
	);

	forGame = Object.assign(
		async (gameId: Id) => {
			return this.methods.getGameCharacters(gameId);
		},
		{
			withPrimaryFactions: async (gameId: Id) => {
				return this.methods.getGameCharactersWithPrimaryFaction(gameId);
			},
		},
	);

	links = {
		add: {
			notes: async (charId: Id, noteIds: Id[]) => {
				return this.linkNotes(charId, noteIds);
			},
			factions: async (charId: Id, factionIds: Id[]) => {
				return this.linkFactions(charId, factionIds);
			},
		},
		set: {
			notes: async (charId: Id, noteIds: Id[]) => {
				return this.updateLinkedNotes(charId, noteIds);
			},
			factions: async (charId: Id, factionIds: Id[]) => {
				return this.updateLinkedFactions(charId, factionIds);
			},
		},
		remove: {
			note: async (charId: Id, noteId: Id) => {
				return this.unlinkNote(charId, noteId);
			},
			faction: async (charId: Id, noteId: Id) => {
				return this.unlinkFaction(charId, noteId);
			},
		},
	};

	images = {
		updateCoverImage: async (
			charId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.updateCoverImage(charId, uploadStream, contentType);
		},

		upload: async (
			charId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.uploadImage(charId, uploadStream, contentType);
		},

		getAll: async (charId: Id) => {
			return this.client.get<Image[]>(`characters/${charId}/images`);
		},
	};

	private async createCharacterPermission(
		charId: Id,
		body: CreatePermissionRequestBody,
	) {
		return this.client.post<ServerResponse<Permission>>(
			`characters/${charId}/permissions`,
			body,
		);
	}

	async moveToFolder(charId: Id, folderId: Id): Promise<BasicServerResponse> {
		const body: FolderInteractionRequestBody = { entityId: charId };
		return this.client.post<BasicServerResponse>(`folders/${folderId}/notes`, body);
	}

	factions = Object.assign(
		async (charId: Id) => {
			return this.methods.getCharacterFactions(charId);
		},
		{
			link: (charId: Id, factionIds: Id[]) => {
				return this.linkFactions(charId, factionIds);
			},
			unlink: (charId: Id, factionId: Id) => {
				return this.unlinkFaction(charId, factionId);
			},
			replaceLinks: (charId: Id, factionIds: Id[]) => {
				return this.updateLinkedFactions(charId, factionIds);
			},
			primary: async (charId: Id) => {
				return this.getPrimaryFaction(charId);
			},
		},
	);

	private async getPrimaryFaction(charId: Id): Promise<FactionWithMembers | null> {
		return this.client.get<FactionWithMembers | null>(
			`characters/${charId}/factions/primary`,
		);
	}

	private async linkFactions(
		charId: Id,
		factionIds: Id[],
	): Promise<ServerResponse<{ factionIds: Id[] }>> {
		return this.client.post<ServerResponse<{ factionIds: Id[] }>>(
			`characters/${charId}/factions`,
			{ factionIds },
		);
	}

	private async updateLinkedFactions(
		charId: Id,
		factionIds: Id[],
	): Promise<ServerResponse<{ factionIds: Id[] }>> {
		return this.client.put<ServerResponse<{ factionIds: Id[] }>>(
			`characters/${charId}/factions`,
			{ factionIds },
		);
	}

	private async unlinkFaction(charId: Id, factionId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(
			`characters/${charId}/factions/${factionId}`,
		);
	}

	notes = Object.assign(
		async (charId: Id) => {
			return this.methods.getCharacterNotes(charId);
		},
		{
			link: async (charId: Id, noteIds: Id[]) => {
				return this.linkNotes(charId, noteIds);
			},
			unlink: async (charId: Id, noteId: Id) => {
				return this.unlinkNote(charId, noteId);
			},
			replaceLinks: async (charId: Id, noteIds: Id[]) => {
				return this.updateLinkedNotes(charId, noteIds);
			},
		},
	);

	private async linkNotes(
		charId: Id,
		noteIds: Id[],
	): Promise<ServerResponse<{ noteIds: Id[] }>> {
		return this.client.post<ServerResponse<{ noteIds: Id[] }>>(
			`characters/${charId}/notes`,
			{ noteIds },
		);
	}
	private async unlinkNote(charId: Id, noteId: Id) {
		return this.client.delete<BasicServerResponse>(
			`characters/${charId}/notes/${noteId}`,
		);
	}
	private async updateLinkedNotes(
		charId: Id,
		noteIds: Id[],
	): Promise<ServerResponse<{ noteIds: Id[] }>> {
		return this.client.put<ServerResponse<{ noteIds: Id[] }>>(
			`characters/${charId}/notes`,
			{ noteIds },
		);
	}

	private async updateCoverImage(
		charId: Id,
		uploadStream: ReadableStream<Uint8Array>,
		contentType: string,
	) {
		return this.client.postImage<ServerResponse<Character>>(
			`characters/${charId}/cover`,
			uploadStream,
			{
				headers: {
					"Content-Type": contentType,
				},
			},
		);
	}

	private async uploadImage(
		charId: Id,
		uploadStream: ReadableStream<Uint8Array>,
		contentType: string,
	) {
		return this.client.postImage<ServerResponse<Image>>(
			`characters/${charId}/images`,
			uploadStream,
			{
				headers: {
					"Content-Type": contentType,
				},
			},
		);
	}

	private async getCharacterWithPermissions(charId: Id) {
		return this.client.get<CharacterWithPermissions>(
			`characters/${charId}/permissions`,
		);
	}
}
