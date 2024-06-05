import { type INTENT, IntentSchema } from "@repo/db";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";

export const itemOrArrayToArray = <T>(input: T | T[] | undefined): T[] => {
	let output: T[] = [];

	if (input) {
		if (Array.isArray(input)) {
			output = input;
		} else {
			output.push(input);
		}
	}

	return output;
};

export const getIntentOrThrow = async (request: Request): Promise<INTENT> => {
	const result = await zx.parseFormSafe(request, {
		intent: z.string(),
	});

	if (!result.success) {
		throw internalServerError();
	}

	let validIntent: INTENT;

	try {
		validIntent = IntentSchema.parse(result.data.intent);
	} catch (err) {
		throw internalServerError();
	}

	return validIntent;
};

export function internalServerError() {
	return new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
		message: ReasonPhrases.INTERNAL_SERVER_ERROR,
	});
}
export function badRequestExeption(message: string) {
	return new HTTPException(StatusCodes.BAD_REQUEST, {
		message,
	});
}

export const getUserIdQueryParam = (c: Context) => {
	const { userId } = c.req.query();
	if (!userId) {
		throw badRequestExeption("No userId query string provided.");
	}
	return userId;
};
