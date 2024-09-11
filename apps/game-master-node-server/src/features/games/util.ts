import type { CreateGameRequestBody } from "@repo/api";
import type { InsertDatabaseGame } from "~/db/schema/games";
import { generateGameId } from "~/lib/ids";

export const createGameInsert = (input: CreateGameRequestBody): InsertDatabaseGame => {
	const currentDate = new Date();
	return {
		id: generateGameId(),
		name: input.name,
		ownerId: input.ownerId,
		createdAt: currentDate,
		updatedAt: currentDate,
	};
};
