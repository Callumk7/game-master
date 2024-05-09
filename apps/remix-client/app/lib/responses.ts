import { INTENT, IntentSchema } from "@repo/db";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";

export const getIntentOrThrow = async (request: Request): Promise<INTENT> => {
	const result = await zx.parseFormSafe(request, {
		intent: z.string(),
	});

	if (!result.success) {
		throw new Response("No intent provided", {
			status: StatusCodes.BAD_REQUEST,
			statusText: ReasonPhrases.BAD_REQUEST,
		});
	}

	let validIntent: INTENT;

	try {
		validIntent = IntentSchema.parse(result.data.intent);
	} catch (err) {
		throw new Response("Invalid intent provided", {
			status: StatusCodes.BAD_REQUEST,
			statusText: ReasonPhrases.BAD_REQUEST,
		});
	}

	return validIntent;
};
