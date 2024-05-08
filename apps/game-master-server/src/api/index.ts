import { ResultSet } from "@libsql/client";
import { DB } from "~/db";
import { characters } from "~/db/schemas/characters";
import { factions } from "~/db/schemas/factions";
import { folders, notes } from "~/db/schemas/notes";
import { plots } from "~/db/schemas/plots";
import { sessions } from "~/db/schemas/sessions";
import { MultiSelectString, OptionalEntitySchema } from "~/types/zod";
import { INTENT, LINK_INTENT, badRequest, getIntentOrThrow, noContent } from "./util";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { itemOrArrayToArray } from "~/utils";
import { BasicEntity } from "~/types";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const getAllUserEntities = async (db: DB, userId: string) => {
	const unsortedNotesPromise = db.query.notes.findMany({
		where: and(
			eq(notes.userId, userId),
			eq(notes.isLinkNote, false),
			eq(notes.folderId, "NONE"),
		),
	});

	const allFoldersPromise = db.query.folders.findMany({
		where: eq(folders.userId, userId),
		with: {
			notes: true,
		},
	});
	const allPlotsPromise = db.select().from(plots).where(eq(plots.userId, userId));
	const allCharactersPromise = db
		.select()
		.from(characters)
		.where(eq(characters.userId, userId));
	const allFactionsPromise = db
		.select()
		.from(factions)
		.where(eq(factions.userId, userId));
	const allSessionsPromise = db
		.select()
		.from(sessions)
		.where(eq(sessions.userId, userId));

	const [unsortedNotes, allFolders, allCharacters, allFactions, allPlots, allSessions] =
		await Promise.all([
			unsortedNotesPromise,
			allFoldersPromise,
			allCharactersPromise,
			allFactionsPromise,
			allPlotsPromise,
			allSessionsPromise,
		]);

	const allNotes = unsortedNotes.concat(allFolders.flatMap((folder) => folder.notes));

	return {
		allNotes,
		unsortedNotes,
		allFolders,
		allCharacters,
		allFactions,
		allPlots,
		allSessions,
	};
};

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

// WARN: I am not currently using the below HOF. I think it is better practice
// to stick to a handler specific for each entity, as this makes updating these
// in the future easier as they are decoupled and specific for their own intent
type UpdateFunction<T extends BasicEntity> = (
	db: DB,
	update: Partial<T>,
	entityId: string,
) => Promise<T>;

/**
 * Higher order function that updates the name and description of the
 * entity as per the provided update function.
 */
// export const handleUpdateEntity = async <T extends BasicEntity>(
// 	db: DB,
// 	entityId: string,
// 	request: Request,
// 	updateFunction: UpdateFunction<T>,
// ) => {
// 	const intent = await getIntentOrThrow(request);
// 	let update: Partial<T> = {};
// 	switch (intent) {
// 		case INTENT.UPDATE_NAME: {
// 			const { name } = await zx.parseForm(request, { name: z.string() });
// 			update = { ...update, name };
// 			break;
// 		}
// 		case INTENT.UPDATE_CONTENT: {
// 			const { description } = await zx.parseForm(request, {
// 				description: z.string(),
// 			});
// 			update = { ...update, description };
// 			break;
// 		}
// 		case INTENT.UPDATE_CONNECTIONS:
// 			throw badRequest("Incorrect location to update connections");
// 		default:
// 			throw badRequest("Intent not recognised.");
// 	}
// 	const updatedEntity = await updateFunction(db, update, entityId);
// 	return new Response(JSON.stringify({ update: updatedEntity }));
// };
//
type UnLinkFunction = (db: DB, targetId: string, entityIds: string[]) => Promise<void>;
type UnlinkHandlerFunctions = {
	characters?: UnLinkFunction;
	allies?: UnLinkFunction;
	enemies?: UnLinkFunction;
	factions?: UnLinkFunction;
	sessions?: UnLinkFunction;
	notes?: UnLinkFunction;
	plots?: UnLinkFunction;
};

// export const handleUnlinkEntities = async (
// 	db: DB,
// 	targetId: string,
// 	request: Request,
// 	unLinkFunction: UnLinkFunction,
// ) => {
// 	const { entity_id } = await zx.parseForm(request, {
// 		entity_id: OptionalEntitySchema,
// 	});
// 	const entityIds = itemOrArrayToArray(entity_id);
// 	await unLinkFunction(db, targetId, entityIds);
// 	return noContent();
// };
//
// export const handleUnlinkingByIntent = async (
// 	db: DB,
// 	targetId: string,
// 	request: Request,
// 	intent: LINK_INTENT,
// 	handlerFunctions: UnlinkHandlerFunctions,
// ): Promise<Response> => {
// 	switch (intent) {
// 		case LINK_INTENT.NOTES:
// 			if (handlerFunctions.notes) {
// 				await handleUnlinkEntities(db, targetId, request, handlerFunctions.notes);
// 			}
// 			break;
// 		case LINK_INTENT.CHARACTERS:
// 			if (handlerFunctions.characters) {
// 				await handleUnlinkEntities(
// 					db,
// 					targetId,
// 					request,
// 					handlerFunctions.characters,
// 				);
// 			}
// 			break;
// 		case LINK_INTENT.ALLIES:
// 			if (handlerFunctions.allies) {
// 				await handleUnlinkEntities(
// 					db,
// 					targetId,
// 					request,
// 					handlerFunctions.allies,
// 				);
// 			}
// 			break;
// 		case LINK_INTENT.ENEMIES:
// 			if (handlerFunctions.enemies) {
// 				await handleUnlinkEntities(
// 					db,
// 					targetId,
// 					request,
// 					handlerFunctions.enemies,
// 				);
// 			}
// 			break;
// 		case LINK_INTENT.FACTIONS:
// 			if (handlerFunctions.factions) {
// 				await handleUnlinkEntities(
// 					db,
// 					targetId,
// 					request,
// 					handlerFunctions.factions,
// 				);
// 			}
// 			break;
// 		case LINK_INTENT.PLOTS:
// 			if (handlerFunctions.plots) {
// 				await handleUnlinkEntities(db, targetId, request, handlerFunctions.plots);
// 			}
// 			break;
// 		case LINK_INTENT.SESSIONS:
// 			if (handlerFunctions.sessions) {
// 				await handleUnlinkEntities(
// 					db,
// 					targetId,
// 					request,
// 					handlerFunctions.sessions,
// 				);
// 			}
// 			break;
// 		default:
// 			throw badRequest("Invalid intent.");
// 	}
// 	return noContent();
// };
