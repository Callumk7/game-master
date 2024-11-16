import type { Client } from "../client.js";
import type {
	Character,
	CharacterWithFaction,
	Faction,
	FactionWithMembers,
	Id,
	Note,
} from "../index.js";

export class Methods {
	constructor(private client: Client) {}

	async getGameCharacters(gameId: Id) {
		return this.client.get<Character[]>(`games/${gameId}/characters`);
	}

	async getGameCharactersWithPrimaryFaction(gameId: Id) {
		return this.client.get<CharacterWithFaction[]>(`games/${gameId}/characters`, {
			searchParams: { withData: "primaryFaction" },
		});
	}

	async getGameFactions(gameId: Id) {
		return this.client.get<Faction[]>(`games/${gameId}/factions`);
	}

	async getGameFactionsWithMembers(gameId: Id) {
		return this.client.get<FactionWithMembers[]>(`games/${gameId}/factions`, {
			searchParams: { withData: "members" },
		});
	}

	async getGameNotes(gameId: Id) {
		return this.client.get<Note[]>(`games/${gameId}/notes`);
	}

	async getCharacterFactions(charId: Id) {
		return this.client.get<Faction[]>(`characters/${charId}/factions`);
	}

	async getCharacterNotes(charId: Id) {
		return this.client.get<Note[]>(`characters/${charId}/notes`);
	}
}
