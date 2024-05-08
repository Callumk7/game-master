import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { z } from "zod";

export function notFound() {
	return new Response(ReasonPhrases.NOT_FOUND, {
		status: StatusCodes.NOT_FOUND,
		statusText: ReasonPhrases.NOT_FOUND,
	});
}

export function badRequest(body: string) {
	return new Response(body, {
		status: StatusCodes.BAD_REQUEST,
		statusText: ReasonPhrases.BAD_REQUEST,
	});
}

export function methodNotAllowed() {
	return new Response(ReasonPhrases.METHOD_NOT_ALLOWED, {
		status: StatusCodes.METHOD_NOT_ALLOWED,
		statusText: ReasonPhrases.METHOD_NOT_ALLOWED,
	});
}

export function noContent() {
	return new Response(undefined, {
		status: StatusCodes.NO_CONTENT,
		statusText: ReasonPhrases.NO_CONTENT,
	});
}

export function internalServerError() {
	return new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
	});
}

export enum INTENT {
	UPDATE_CONTENT = "UPDATE_CONTENT",
	UPDATE_NAME = "UPDATE_NAME",
	UPDATE_CONNECTIONS = "UPDATE_CONNECTIONS",
	UPDATE_BIO = "UPDATE_BIO",
}
export const IntentSchema = z.nativeEnum(INTENT);

export enum LINK_INTENT {
	CHARACTERS = "CHARACTERS",
	ALLIES = "ALLIES",
	ENEMIES = "ENEMIES",
	NOTES = "NOTES",
	FACTIONS = "FACTIONS",
	PLOTS = "PLOTS",
	SESSIONS = "SESSIONS",
	ALL = "ALL",
}
export const LinkIntentSchema = z.nativeEnum(LINK_INTENT);

export enum NOTE_TYPE {
	SESSION_CHAR = "SESSION_CHAR",
	SESSION_FACTION = "SESSION_FACTION",
	SESSION_PLOT = "SESSION_PLOT",
	CHAR_FACTION = "CHAR_FACTION",
	CHAR_PLOT = "CHAR_PLOT",
	FACTION_PLOT = "FACTION_PLOT",
}
export const NoteTypeSchema = z.nativeEnum(NOTE_TYPE);

// export const getIntentOrThrow = async (request: Request): Promise<INTENT> => {
// 	const result = await zx.parseFormSafe(request, {
// 		intent: z.string(),
// 	});
//
// 	if (!result.success) {
// 		throw new Response("No intent provided", {
// 			status: StatusCodes.BAD_REQUEST,
// 			statusText: ReasonPhrases.BAD_REQUEST,
// 		});
// 	}
//
// 	let validIntent: INTENT;
//
// 	try {
// 		validIntent = IntentSchema.parse(result.data.intent);
// 	} catch (err) {
// 		throw new Response("Invalid intent provided", {
// 			status: StatusCodes.BAD_REQUEST,
// 			statusText: ReasonPhrases.BAD_REQUEST,
// 		});
// 	}
//
// 	return validIntent;
// };
