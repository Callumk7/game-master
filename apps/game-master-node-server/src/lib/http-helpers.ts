import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema } from "zod";

export async function validateOrThrowError<T>(schema: ZodSchema<T>, c: Context) {
	try {
		const result = schema.safeParse(await c.req.json());
		if (!result.success) {
			console.error(result.error.message);
			throw new HTTPException(400, { message: result.error.message });
		}
		return result.data;
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}
		throw new HTTPException(400, { message: "Failed to parse JSON" });
	}
}

export function successResponse<T>(c: Context, data: T) {
	return c.json({ success: true, data });
}

export function handleNotFound(c: Context, error?: unknown) {
	if (error) console.error(error);
	return c.text("Not found", 401);
}

export function handleDatabaseError(c: Context, error?: unknown) {
	if (error) console.error(error);
	return c.text("Database Error", 500);
}
