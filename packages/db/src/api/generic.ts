import { ResultSet } from "@libsql/client/.";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { DB } from "../db";
import { MultiSelectString } from "../types";
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
