import { Hono } from "hono";
import { AuthClient, InMemoryStorage } from "@repo/auth";
import { verifyToken } from "./jwt";

export const authRoute = new Hono();

const storage = new InMemoryStorage();
const auth = new AuthClient("http://localhost:4000", 1, storage);

authRoute.get("/", (c) => {
	return c.text("Please use the /login route to authenticate your requests.");
});

authRoute.post("/login", async (c) => {
	try {
		const { email, password } = await c.req.json();

		await auth.login(email, password);

		//console.log(await verifyToken(auth.getAccessToken()!))

		if (auth.isAuthenticated()) {
			return c.json({ token: auth.getAccessToken() });
		}
		return c.json({ error: "Invalid credentials" }, 401);
	} catch (error) {
		return c.json({ error: "Invalid request" }, 400);
	}
});

authRoute.post("/signup", async (c) => {
	try {
		const { email, password } = await c.req.json();

		await auth.signUp(email, password);

		if (auth.isAuthenticated()) {
			const data = await verifyToken(auth.getAccessToken()!)
			console.log(data)
			return c.json({ token: auth.getAccessToken() });
		}
		return c.json({ error: "Something went wrong" }, 401);
	} catch (error) {
		return c.json({ error: "Invalid request" }, 400);
	}
});
