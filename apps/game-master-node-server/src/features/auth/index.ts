import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { users } from "~/db/schema/users";
import type { Variables } from "~/types";
import { generateToken } from "./jwt";

export const authRoute = new Hono<{ Variables: Variables }>();

authRoute.get("/", (c) => {
	return c.text("Please use the /login route to authenticate your requests.");
});

authRoute.get("/user", async (c) => {
	const authUser = c.get("user");
	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id),
	});

	return c.json(user);
});

authRoute.post("/login", async (c) => {
	try {
		const { email, password } = await c.req.json();

		// TODO: Replace with actual database validation
		if (email === "user@example.com" && password === "password") {
			const token = await generateToken({
				userId: "user_0426b71b-71cb-4044-aef6-6bba0f71bb36",
			});
			return c.json({ token });
		}
		return c.json({ error: "Invalid credentials" }, 401);
	} catch (error) {
		return c.json({ error: "Invalid request" }, 400);
	}
});
