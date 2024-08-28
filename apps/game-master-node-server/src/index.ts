import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "./features/auth";

import type { Env } from "hono";
import type { User, Session } from "lucia";
import { renderHTMLTemplate } from "./lib/html";
import { loginRouter } from "./features/login/route";
import { signupRouter } from "./features/signup/route";

export interface Context extends Env {
	Variables: {
		user: User | null;
		session: Session | null;
	};
}

const app = new Hono<Context>();

app.use("*", async (c, next) => {
	if (c.req.method === "GET") {
		return next();
	}

	const originHeader = c.req.header("Origin") ?? null;
	const hostHeader = c.req.header("Host") ?? null;

	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader])
	) {
		return c.body(null, 403);
	}
	return next();
});

// Set User and Session from request cookie 
app.use("*", async (c, next) => {
	const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
	if (!sessionId) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session?.fresh) {
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true,
		});
	}

	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}

	c.set("session", session);
	c.set("user", user);

	return next();
});

app.get("/", async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.redirect("/login");
	}

	const html = await renderHTMLTemplate("src/index.template.html", {
		email: user.email,
		user_id: user.id,
	});

	return c.html(html, 200);
});

app.route("/login", loginRouter);
app.route("/signup", signupRouter);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export default app;
