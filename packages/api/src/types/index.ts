export type Id = string;

type SuccessfulResponse<T> = { success: true; data: T };
type Unsuccessfulresponse = { success: false; message: string };
export type ServerResponse<T> = SuccessfulResponse<T> | Unsuccessfulresponse;
export type BasicServerResponse = { success: boolean };

export type BasicEntity = {
	id: Id;
	name: string;
	gameId: string;
}

export type EntityType = "notes" | "characters" | "factions";
