import type { Id } from "@repo/api";

export type EntityType = "note" | "faction" | "character";

export type BasicEntity = {
	id: Id;
	name: string;
};
