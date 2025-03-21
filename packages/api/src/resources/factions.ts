import type { Client } from "../client.js";
import type {
	CreateFactionRequestBody,
	DuplicateFactionRequestBody,
	Faction,
	FactionMember,
	FactionWithPermissions,
	UpdateFactionRequestBody,
} from "../types/factions.js";
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

export class Factions {
	constructor(
		private client: Client,
		private methods: Methods,
	) {}

	create = Object.assign(
		async (body: CreateFactionRequestBody) => {
			return this.client.post<ServerResponse<Faction>>("factions", body);
		},
		{
			permission: (factionId: Id, body: CreatePermissionRequestBody) => {
				return this.createFactionPermission(factionId, body);
			},
		},
	);

	async delete(factionId: Id): Promise<BasicServerResponse> {
		return this.client.delete(`factions/${factionId}`);
	}

	async update(
		factionId: Id,
		factionDetails: UpdateFactionRequestBody,
	): Promise<ServerResponse<Faction>> {
		return this.client.patch<ServerResponse<Faction>>(
			`factions/${factionId}`,
			factionDetails,
		);
	}

	async duplicate(
		factionId: Id,
		duplicateData: DuplicateFactionRequestBody,
	): Promise<ServerResponse<Faction>> {
		return this.client.post<ServerResponse<Faction>>(
			`factions/${factionId}/duplicate`,
			duplicateData,
		);
	}

	getFaction = Object.assign(
		async (factionId: Id) => {
			return this.client.get<Faction>(`factions/${factionId}`);
		},
		{
			withPermissions: (factionId: Id) => {
				return this.getFactionWithPermissions(factionId);
			},
		},
	);

	forGame = Object.assign(
		async (gameId: Id) => {
			return this.methods.getGameFactions(gameId);
		},
		{
			withMembers: async (gameId: Id) => {
				return this.methods.getGameFactionsWithMembers(gameId);
			},
		},
	);

	private async getFactionWithPermissions(
		factionId: Id,
	): Promise<FactionWithPermissions> {
		return this.client.get<FactionWithPermissions>(
			`factions/${factionId}/permissions`,
		);
	}

	private async createFactionPermission(
		factionId: Id,
		body: CreatePermissionRequestBody,
	): Promise<ServerResponse<Permission>> {
		return this.client.post<ServerResponse<Permission>>(
			`factions/${factionId}/permissions`,
			body,
		);
	}

	async members(factionId: Id): Promise<FactionMember[]> {
		return this.client.get<FactionMember[]>(`factions/${factionId}/members`);
	}

	async moveToFolder(factionId: Id, folderId: Id): Promise<BasicServerResponse> {
		const body: FolderInteractionRequestBody = { entityId: factionId };
		return this.client.post<BasicServerResponse>(`folders/${folderId}/notes`, body);
	}

	images = {
		updateCoverImage: async (
			factionId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.updateCoverImage(factionId, uploadStream, contentType);
		},

		upload: async (
			factionId: Id,
			uploadStream: ReadableStream<Uint8Array>,
			contentType: string,
		) => {
			return this.uploadImage(factionId, uploadStream, contentType);
		},

		getAll: async (factionId: Id) => {
			return this.client.get<Image[]>(`factions/${factionId}/images`);
		},
	};

	private async updateCoverImage(
		factionId: Id,
		uploadStream: ReadableStream<Uint8Array>,
		contentType: string,
	) {
		return this.client.postImage<ServerResponse<Faction>>(
			`factions/${factionId}/cover`,
			uploadStream,
			{
				headers: {
					"Content-Type": contentType,
				},
			},
		);
	}

	private async uploadImage(
		factionId: Id,
		uploadStream: ReadableStream<Uint8Array>,
		contentType: string,
	) {
		return this.client.postImage<ServerResponse<Image>>(
			`factions/${factionId}/images`,
			uploadStream,
			{
				headers: {
					"Content-Type": contentType,
				},
			},
		);
	}
}
