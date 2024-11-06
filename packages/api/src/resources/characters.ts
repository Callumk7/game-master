import type { Client } from "../client.js";
import type {
	Character,
	CharacterWithFaction,
	CharacterWithPermissions,
	CreateCharacterRequestBody,
	DuplicateCharacterRequestBody,
	UpdateCharacterRequestBody,
} from "../types/characters.js";
import type { Faction, FactionWithMembers } from "../types/factions.js";
import type { FolderInteractionRequestBody } from "../types/folders.js";
import type {
	BasicServerResponse,
	CreatePermissionRequestBody,
	Id,
	Permission,
	ServerResponse,
} from "../types/index.js";
import type { Note } from "../types/notes.js";

export class Characters {
	constructor(private client: Client) {}

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

	getForGame = Object.assign(
		async (gameId: Id) => {
			return this.client.get<Character[]>(`games/${gameId}/characters`);
		},
		{
			withPrimaryFactions: async (gameId: Id) => {
				return this.client.get<CharacterWithFaction[]>(
					`games/${gameId}/characters`,
					{
						searchParams: { withData: "primaryFaction" },
					},
				);
			},
		},
	);

	async getCharacterWithPermissions(charId: Id) {
		return this.client.get<CharacterWithPermissions>(
			`characters/${charId}/permissions`,
		);
	}

	// DONE
	async createCharacter(body: CreateCharacterRequestBody) {
		return this.client.post<ServerResponse<Character>>("characters", body);
	}

	// DONE
	async deleteCharacter(charId: Id) {
		return this.client.delete(`characters/${charId}`);
	}

	// DONE
	async duplicateCharacter(charId: Id, duplicateData: DuplicateCharacterRequestBody) {
		return this.client.post<ServerResponse<Character>>(
			`characters/${charId}/duplicate`,
			duplicateData,
		);
	}

	async createCharacterPermission(charId: Id, body: CreatePermissionRequestBody) {
		return this.client.post<ServerResponse<Permission>>(
			`characters/${charId}/permissions`,
			body,
		);
	}

	// DONE
	async updateCharacterDetails(charId: Id, charDetails: UpdateCharacterRequestBody) {
		return this.client.patch<ServerResponse<Character>>(
			`characters/${charId}`,
			charDetails,
		);
	}

	async moveToFolder(charId: Id, folderId: Id): Promise<BasicServerResponse> {
		const body: FolderInteractionRequestBody = { entityId: charId };
		return this.client.post<BasicServerResponse>(`folders/${folderId}/notes`, body);
	}

	async getPrimaryFaction(charId: Id): Promise<FactionWithMembers | null> {
		return this.client.get<FactionWithMembers | null>(
			`characters/${charId}/factions/primary`,
		);
	}

	async getFactions(charId: Id): Promise<Faction[]> {
		return this.client.get<Faction[]>(`characters/${charId}/factions`);
	}

	async linkFactions(
		charId: Id,
		factionIds: Id[],
	): Promise<ServerResponse<{ factionIds: Id[] }>> {
		return this.client.post<ServerResponse<{ factionIds: Id[] }>>(
			`characters/${charId}/factions`,
			{ factionIds },
		);
	}

	async unlinkFaction(charId: Id, factionId: Id): Promise<BasicServerResponse> {
		return this.client.delete<BasicServerResponse>(
			`characters/${charId}/factions/${factionId}`,
		);
	}

	async getNotes(charId: Id): Promise<Note[]> {
		return this.client.get<Note[]>(`characters/${charId}/notes`);
	}

	async linkNotes(
		charId: Id,
		noteIds: Id[],
	): Promise<ServerResponse<{ noteIds: Id[] }>> {
		return this.client.post<ServerResponse<{ noteIds: Id[] }>>(
			`characters/${charId}/notes`,
			{ noteIds },
		);
	}
}
