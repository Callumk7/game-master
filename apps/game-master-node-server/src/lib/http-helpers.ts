import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema } from "zod";

export async function validateOrThrowError<T>(schema: ZodSchema<T>, c: Context) {
	const result = schema.safeParse(await c.req.json());
	if (!result.success) {
		throw new HTTPException(400, { message: result.error.message });
	}

	return result.data;
}

export function returnData(c: Context, data: unknown) {
	return c.json({ success: true, data });
}

export function handleNotFound(c: Context, error?: unknown)  {
	if (error) console.error(error)
	return c.text("Not found", 401);
}

export function handleDatabaseError(c: Context, error?: unknown)  {
	if (error) console.error(error)
	return c.text("Database Error", 500);
}
