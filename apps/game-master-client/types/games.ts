// TODO: Move these to a separate package like before maybe - or find another 
// way to share

export interface Game {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	ownerId: string;
}

export interface CreateGameInput {
	name: string;
	ownerId: string;
}
