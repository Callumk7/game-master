import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { users } from "~/db/schema/users";
import { Context } from "~/index";
import { lucia } from "../auth";
import { renderHTMLTemplate } from "~/lib/html";

export const loginRouter = new Hono<Context>();

loginRouter.get("/", async (c) => {
	const session = c.get("session");
	if (session) {
		return c.redirect("/");
	}
	const html = await renderPage();
	return c.html(html, 200);
});

loginRouter.post("/", async (c) => {
	const body = await c.req.parseBody<{
		email: string;
		password: string;
	}>();
	const email: string | null = body.email ?? null;
	if (!email || email.length < 3 || email.length > 31 || !/^[a-z0-9_-]+$/.test(email)) {
		const html = await renderPage({
			username_value: email ?? "",
			error: "Invalid password"
		});
		return c.html(html, 200);
	}
	const password: string | null = body.password ?? null;
	if (!password || password.length < 6 || password.length > 255) {
		const html = await renderPage({
			username_value: email,
			error: "Invalid password"
		});
		return c.html(html, 200);
	}

	const results = await db.select().from(users).where(eq(users.email, email))
	const existingUser = results[0];

	if (!existingUser) {
		const html = await renderPage({
			username_value: email,
			error: "Incorrect username or password"
		});
		return c.html(html, 200);
	}

	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	if (!validPassword) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
		// If usernames are public, you can outright tell the user that the username is invalid.
		const html = await renderPage({
			username_value: email,
			error: "Incorrect username or password"
		});
		return c.html(html, 200);
	}

	const session = await lucia.createSession(existingUser.id, {});
	c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
	c.header("Location", "/", { append: true });
	return c.redirect("/");
});

async function renderPage(args?: { username_value?: string; error?: string }): Promise<string> {
	return await renderHTMLTemplate("src/features/login/login.template.html", {
		username_value: args?.username_value ?? "",
		error: args?.error ?? ""
	});
}
