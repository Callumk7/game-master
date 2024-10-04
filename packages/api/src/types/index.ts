import { z } from "zod";

export type Id = string;

type SuccessfulResponse<T> = { success: true; data: T };
type Unsuccessfulresponse = { success: false; message: string };
export type ServerResponse<T> = SuccessfulResponse<T> | Unsuccessfulresponse;
export type BasicServerResponse = { success: boolean };

export interface BasicEntity {
	id: Id;
	name: string;
	gameId: string;
}

export interface BasicEntityWithDates extends BasicEntity {
	createdAt: Date;
	updatedAt: Date;
}

export type EntityType = "notes" | "characters" | "factions";

export const visibilitySchema = z.enum(["public", "private", "viewable", "partial"]);
export type Visibility = z.infer<typeof visibilitySchema>;
