import type { Context } from "hono";

export const getPayload = (c: Context): { userId: string } => {
	return c.get("jwtPayload") as { userId: string };
};
