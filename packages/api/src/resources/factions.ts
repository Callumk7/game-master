import type { Client } from "../client.js";
import type { CreateFactionRequestBody, Faction, FactionWithMembers, FactionWithNotes, UpdateFactionRequestBody } from "../types/factions.js";
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

	async updateFactionDetails(
		factionId: Id,
		factionDetails: UpdateFactionRequestBody,
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

	async getFactionWithNotes(factionId: Id): Promise<FactionWithNotes> {
		return this.client.get<FactionWithNotes>(`factions/${factionId}/notes`);
	}

	async getFactionWithMembers(factionId: Id): Promise<FactionWithMembers> {
		return this.client.get<FactionWithMembers>(`factions/${factionId}/members`);
	}
}
