import type { Id } from "@repo/api";

export type EntityType = "notes" | "factions" | "characters";

export type BasicEntity = {
	id: Id;
	gameId: Id;
	name: string;
};
