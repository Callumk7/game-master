import { AlligatorServer } from "alligator-auth";
import type { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
	const auth = new AlligatorServer(1);

	try {
		const user = await auth.getUserFromRequest(c.req.raw);
		console.log(user);
		c.set("user", user);
		await next();
	} catch (error) {
		// some sort of redirect to login
		return new Response("Not logged in", { status: 401 });
	}
};
