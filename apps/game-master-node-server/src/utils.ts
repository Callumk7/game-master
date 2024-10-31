import type { HonoRequest } from "hono";
import { StatusCodes } from "http-status-codes";
import { badRequestResponse, httpException } from "./lib/http-helpers";

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

// biome-ignore lint/suspicious/noExplicitAny: Generic any solved with use of K
export async function resolve<T extends any[]>(
	...promises: { [K in keyof T]: Promise<T[K]> }
): Promise<T> {
	return Promise.all(promises);
}

/**
 * This function will throw a httpException, handled by Hono (returns early)
 */
export async function validateUploadIsImageOrThrow(req: HonoRequest) {
	const body = await req.parseBody();
	const image = body.image;
	if (!(image instanceof File)) {
		console.error("image from body is not an instance of File");
		throw httpException(StatusCodes.BAD_REQUEST);
	}

	const ownerId = body.ownerId;
	if (typeof ownerId !== "string") {
		console.error("owner id field is not of type string");
		throw httpException(StatusCodes.BAD_REQUEST);
	}

	return {
		ownerId,
		image,
	};
}
