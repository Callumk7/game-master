export type Id = string;

export interface GameMasterResponse<T> {
	success: boolean;
	data: T;
}

export interface User {
	id: Id;
	firstName: string | undefined;
	lastName: string | undefined;
	username: string;
	email: string;
}

export interface Game {
	id: Id;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: Id;
}
