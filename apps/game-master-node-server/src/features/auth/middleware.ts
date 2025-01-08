import type { Context, Next } from "hono";
import { verifyToken } from "./jwt";

export const authMiddleware = async (c: Context, next: Next) => {
	try {
		const authHeader = c.req.header("Authorization");

		if (!authHeader || authHeader.startsWith("Bearer ")) {
			return c.json({ error: "No token provided" }, 401);
		}

		const token = authHeader.split(" ")[1];
		if (!token) return c.json({ error: "No token provided" }, 401);
		const decoded = await verifyToken(token);

		c.set("user", decoded);
		 await next();
	} catch (error) {
		c.json({ error: "Invalid token" }, 401);
	}
};
