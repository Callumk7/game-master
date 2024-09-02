import { createHonoServer } from "react-router-hono-server/node";
import {
	integrateSessionCookieWithHono,
	verifyRequestOriginMiddleware,
} from "./auth.server";
import { Hono, type Env } from "hono";
import type { User, Session } from "lucia";
import { logger } from "hono/logger";
import { createMiddleware } from "hono/factory";

export interface Context extends Env {
	Variables: {
		user: User | null;
		session: Session | null;
	};
}

const app = new Hono<Context>();

// Hono's builtin logging middleware
app.use("*", logger()); // TODO: externalise logs

// Lucia middleware
app.use("*", verifyRequestOriginMiddleware, integrateSessionCookieWithHono);

export const server = await createHonoServer({
	configure: (server) => {
		server.route("*", app);
	},
});
