import type { ResultSet } from "@libsql/client/.";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import type { DB } from "../db";
import type { MultiSelectString } from "../types";
import { LINK_INTENT, badRequest } from "./util";
import { itemOrArrayToArray } from "../utils";

type LinkFunction<T> = (db: DB, targetId: string, entityIds: string[]) => Promise<T[]>;
type DeleteFunction = (db: DB, targetId: string) => Promise<ResultSet>;

/**
 * A higher order function that handles connecting entities to another
 * single entity. Right now I am only using it for sessions, but the
 * signature can easily be adapted to handle all relationships.
 */
export const handleLinkEntitiesToTarget = async <T>(
	db: DB,
	input: MultiSelectString,
	targetId: string,
	deleteFunction: DeleteFunction,
	linkFunction: LinkFunction<T>,
) => {
	const entitiesToLink = itemOrArrayToArray(input);

	await deleteFunction(db, targetId);

	if (entitiesToLink.length > 0) {
		return await linkFunction(db, targetId, entitiesToLink);
	}
};

export const handleAddLinkToTarget = async <T>(
	db: DB,
	targetId: string,
	linkId: string,
	linkFunction: LinkFunction<T>,
) => {
	return await linkFunction(db, targetId, [linkId]);
};

type AddLinkHandlerFunctions<C, A, E, F, S, N, P> = {
	characters?: LinkFunction<C>;
	allies?: LinkFunction<A>;
	enemies?: LinkFunction<E>;
	factions?: LinkFunction<F>;
	sessions?: LinkFunction<S>;
	notes?: LinkFunction<N>;
	plots?: LinkFunction<P>;
};

export const handleAddLinkToTargetByIntent = async <C, A, E, F, S, N, P>(
	db: DB,
	targetId: string,
	linkId: string,
	intent: LINK_INTENT,
	handlerFunctions: AddLinkHandlerFunctions<C, A, E, F, S, N, P>,
): Promise<Response> => {
	switch (intent) {
		case LINK_INTENT.CHARACTERS:
			if (handlerFunctions.characters) {
				await handleAddLinkToTarget(
					db,
					targetId,
					linkId,
					handlerFunctions.characters,
				);
			}
			break;
		case LINK_INTENT.ALLIES:
			if (handlerFunctions.allies) {
				await handleAddLinkToTarget(
					db,
					targetId,
					linkId,
					handlerFunctions.allies,
				);
			}
			break;
		case LINK_INTENT.ENEMIES:
			if (handlerFunctions.enemies) {
				await handleAddLinkToTarget(
					db,
					targetId,
					linkId,
					handlerFunctions.enemies,
				);
			}
			break;
		case LINK_INTENT.NOTES:
			if (handlerFunctions.notes) {
				await handleAddLinkToTarget(db, targetId, linkId, handlerFunctions.notes);
			}
			break;
		case LINK_INTENT.FACTIONS:
			if (handlerFunctions.factions) {
				await handleAddLinkToTarget(
					db,
					targetId,
					linkId,
					handlerFunctions.factions,
				);
			}
			break;
		case LINK_INTENT.PLOTS:
			if (handlerFunctions.plots) {
				await handleAddLinkToTarget(db, targetId, linkId, handlerFunctions.plots);
			}
			break;
		case LINK_INTENT.SESSIONS:
			if (handlerFunctions.sessions) {
				await handleAddLinkToTarget(
					db,
					targetId,
					linkId,
					handlerFunctions.sessions,
				);
			}
			break;
		case LINK_INTENT.ALL:
			return badRequest("Unable to handle linking all types");
		default:
			return badRequest("Unrecognised intent.");
	}
	return new Response(
		JSON.stringify({
			success: true,
			targetId,
			linkId: linkId,
		}),
		{ status: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED },
	);
};

type HandlerFunctions<C, A, E, F, S, N, P> = {
	characters?: {
		link: LinkFunction<C>;
		delete: DeleteFunction;
	};
	allies?: {
		link: LinkFunction<A>;
		delete: DeleteFunction;
	};
	enemies?: {
		link: LinkFunction<E>;
		delete: DeleteFunction;
	};
	factions?: {
		link: LinkFunction<F>;
		delete: DeleteFunction;
	};
	sessions?: {
		link: LinkFunction<S>;
		delete: DeleteFunction;
	};
	notes?: {
		link: LinkFunction<N>;
		delete: DeleteFunction;
	};
	plots?: {
		link: LinkFunction<P>;
		delete: DeleteFunction;
	};
};

export const handleLinkingByIntent = async <C, A, E, F, S, N, P>(
	db: DB,
	targetId: string,
	entityIds: MultiSelectString,
	intent: LINK_INTENT,
	handlerFunctions: HandlerFunctions<C, A, E, F, S, N, P>,
): Promise<Response> => {
	switch (intent) {
		case LINK_INTENT.CHARACTERS:
			if (handlerFunctions.characters) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.characters.delete,
					handlerFunctions.characters.link,
				);
			}
			break;
		case LINK_INTENT.ALLIES:
			if (handlerFunctions.allies) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.allies.delete,
					handlerFunctions.allies.link,
				);
			}
			break;
		case LINK_INTENT.ENEMIES:
			if (handlerFunctions.enemies) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.enemies.delete,
					handlerFunctions.enemies.link,
				);
			}
			break;
		case LINK_INTENT.NOTES:
			if (handlerFunctions.notes) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.notes.delete,
					handlerFunctions.notes.link,
				);
			}
			break;
		case LINK_INTENT.FACTIONS:
			if (handlerFunctions.factions) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.factions.delete,
					handlerFunctions.factions.link,
				);
			}
			break;
		case LINK_INTENT.PLOTS:
			if (handlerFunctions.plots) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.plots.delete,
					handlerFunctions.plots.link,
				);
			}
			break;
		case LINK_INTENT.SESSIONS:
			if (handlerFunctions.sessions) {
				await handleLinkEntitiesToTarget(
					db,
					entityIds,
					targetId,
					handlerFunctions.sessions.delete,
					handlerFunctions.sessions.link,
				);
			}
			break;
		case LINK_INTENT.ALL:
			return badRequest("Unable to handle linking all types");
		default:
			return badRequest("Unrecognised intent.");
	}
	return new Response(
		JSON.stringify({
			success: true,
			targetId,
			entityIds: entityIds,
		}),
		{ status: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED },
	);
};

type RemoveLinkFunction = (
	db: DB,
	targetId: string,
	entityIds: string[],
) => Promise<ResultSet>;
type RemoveLinkFunctions = {
	characters?: RemoveLinkFunction;
	allies?: RemoveLinkFunction;
	enemies?: RemoveLinkFunction;
	factions?: RemoveLinkFunction;
	sessions?: RemoveLinkFunction;
	notes?: RemoveLinkFunction;
	plots?: RemoveLinkFunction;
};
export const handleRemoveLinkByIntent = async (
	db: DB,
	targetId: string,
	entityIds: MultiSelectString,
	intent: LINK_INTENT,
	removeFunctions: RemoveLinkFunctions,
) => {
	const ids = itemOrArrayToArray(entityIds);
	switch (intent) {
		case LINK_INTENT.CHARACTERS:
			if (removeFunctions.characters) {
				await removeFunctions.characters(db, targetId, ids);
			}
			break;
		case LINK_INTENT.ALLIES:
			if (removeFunctions.allies) {
				await removeFunctions.allies(db, targetId, ids);
			}
			break;

		case LINK_INTENT.ENEMIES:
			if (removeFunctions.enemies) {
				await removeFunctions.enemies(db, targetId, ids);
			}
			break;
		case LINK_INTENT.NOTES:
			if (removeFunctions.notes) {
				await removeFunctions.notes(db, targetId, ids);
			}
			break;
		case LINK_INTENT.FACTIONS:
			if (removeFunctions.factions) {
				await removeFunctions.factions(db, targetId, ids);
			}
			break;
		case LINK_INTENT.PLOTS:
			if (removeFunctions.plots) {
				await removeFunctions.plots(db, targetId, ids);
			}
			break;
		case LINK_INTENT.SESSIONS:
			if (removeFunctions.sessions) {
				await removeFunctions.sessions(db, targetId, ids);
			}
			break;
		case LINK_INTENT.ALL:
			console.log("Link intent not currently supported");
			break;
	}
};
