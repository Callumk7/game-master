import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { ZodSchema } from "zod";

export async function validateOrThrowError<T>(schema: ZodSchema<T>, c: Context) {
	try {
		const result = schema.safeParse(await c.req.json());
		if (!result.success) {
			console.error(result.error.message);
			throw new HTTPException(StatusCodes.BAD_REQUEST, {
				message: result.error.message,
			});
		}
		return result.data;
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}
		throw new HTTPException(StatusCodes.BAD_REQUEST, {
			message: "Failed to parse JSON",
		});
	}
}

export function notFoundExeption(status?: StatusCode) {
	return new HTTPException(status);
}

export function successResponse<T>(
	c: Context,
	data: T,
	status: StatusCodes = StatusCodes.OK,
) {
	return c.json({ success: true, data }, status as StatusCode);
}

export function handleNotFound(c: Context, error?: unknown) {
	if (error) console.error(error);
	return c.text(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
}

export function handleDatabaseError(c: Context, error?: unknown) {
	if (error) console.error(error);
	return new Response("Database Error", {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		statusText: "Database Error",
	});
}

export function handleBadRequest(c: Context) {
	return c.text(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
}

export function badRequestResponse(message?: string) {
	return new Response(message, {
		status: StatusCodes.BAD_REQUEST,
		statusText: message ? message : ReasonPhrases.BAD_REQUEST,
	});
}

export function basicSuccessResponse(c: Context) {
	return c.json({ success: true });
}
