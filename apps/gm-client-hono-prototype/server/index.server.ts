import { createHonoServer } from "react-router-hono-server/node";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { session } from "remix-hono/session";
import { createCookieSessionStorage } from "@remix-run/node";

const app = new Hono();

// Hono's builtin logging middleware
app.use("*", logger()); // TODO: externalise logs

// Remix-Hono session middleware
app.use(
	"*",
	session({
		autoCommit: true,
		createSessionStorage() {
			const sessionStorage = createCookieSessionStorage({
				cookie: {
					name: "session",
					httpOnly: true,
					path: "/",
					sameSite: "lax",
					secrets: [process.env.SESSION_SECRET!],
					secure: process.env.NODE_ENV === "production",
				},
			});

			return {
				...sessionStorage,
				// If a user doesn't come back in 30 days, session is binned off
				async commitSession(session) {
					return sessionStorage.commitSession(session, {
						maxAge: 60 * 60 * 24 * 30 // TODO: move this
					})
				},
			}
		},
	}),
);

export const server = await createHonoServer({
	configure: (server) => {
		server.route("*", app);
	},
});
