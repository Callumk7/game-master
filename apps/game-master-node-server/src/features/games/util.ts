import type { CreateGameRequestBody, Id } from "@repo/api";
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

export const findMembersToAddAndRemove = (
	currentMembers: Id[],
	newMembers: Id[],
): { membersToAdd: Id[]; membersToRemove: Id[] } => {
	const membersToAdd: Id[] = [];
	const membersToRemove: Id[] = [];
	for (const id of newMembers) {
		if (!currentMembers.includes(id)) {
			membersToAdd.push(id);
		}
	}

	for (const id of currentMembers) {
		if (!newMembers.includes(id)) {
			membersToRemove.push(id);
		}
	}

	return {
		membersToAdd,
		membersToRemove,
	};
};
