import type { Client } from "../client.js";
import type { CreateFactionRequestBody, Faction, FactionWithNotes } from "../types/factions.js";
import type { ServerResponse, Id, BasicServerResponse } from "../types/index.js";

export class Factions {
	constructor(private client: Client) { }

	async getFaction(factionId: Id): Promise<Faction> {
		return this.client.get<Faction>(`factions/${factionId}`);
	}

	async createFaction(
		body: CreateFactionRequestBody,
	): Promise<ServerResponse<Faction>> {
		return this.client.post<ServerResponse<Faction>>("factions", body);
	}

	async deleteFaction(factionId: Id): Promise<BasicServerResponse> {
		return this.client.delete(`factions/${factionId}`);
	}

	// TODO: change the Partial type to an inferred type based on the updateFaction zod schema
	async updateFactionDetails(
		factionId: Id,
		factionDetails: Partial<Faction>,
	): Promise<ServerResponse<Faction>> {
		return this.client.patch<ServerResponse<Faction>>(
			`factions/${factionId}`,
			factionDetails,
		);
	}

	async getAllGameFactions(gameId: Id): Promise<Faction[]> {
		return this.client.get<Faction[]>(`games/${gameId}/factions`);
	}

	async getUserFactionsForGame(gameId: Id, userId: Id): Promise<Faction[]> {
		return this.client.get<Faction[]>(`games/${gameId}/users/${userId}/factions`);
	}

	async getAllUserFactions(userId: Id): Promise<Faction[]> {
		return this.client.get<Faction[]>(`users/${userId}/factions`);
	}

	async getFactionWithNotes(factionId: Id): Promise<FactionWithNotes[]> {
		return this.client.get<FactionWithNotes[]>(`factions/${factionId}/notes`);
	}
}
