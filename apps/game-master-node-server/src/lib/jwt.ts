import type { Context } from "hono";

export const getPayload = (c: Context): { email: string } => {
	return c.get("jwtPayload") as { email: string };
};
