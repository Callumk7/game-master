import { Hono } from "hono";
import { Bindings } from "..";
import { zx } from "zodix";
import {
	SessionInsert,
	createDrizzleForTurso,
	createSession,
	deleteSession,
	sessionInsertSchema,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { internalServerError } from "~/utils";

export const sessionsRoute = new Hono<{ Bindings: Bindings }>();

sessionsRoute.get("/");

sessionsRoute.post("/", async (c) => {
	const newSessionData = await zx.parseForm(
		c.req.raw,
		sessionInsertSchema.omit({ id: true }),
	);

	const db = createDrizzleForTurso(c.env);
	const sessionInsert: SessionInsert = {
		id: `sesh_${uuidv4()}`,
		...newSessionData,
	};

	// handle some more errors
	const newSession = await createSession(db, sessionInsert);

	return c.json(newSession);
});

sessionsRoute.delete("/:sessionId", async (c) => {
	const sessionId = c.req.param("sessionId");
	const db = createDrizzleForTurso(c.env);
	const result = await deleteSession(db, sessionId);
	if (result.success) {
		return c.text("Session successfully deleted");
	}
	throw internalServerError();
});
