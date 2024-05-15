import { Hono } from "hono";
import { Bindings } from "..";
import { zx } from "zodix";
import {
	SessionInsert,
	badRequest,
	createDrizzleForTurso,
	createSession,
	deleteSession,
	sessionInsertSchema,
	sessions,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { internalServerError } from "~/utils";
import { eq } from "drizzle-orm";

export const sessionsRoute = new Hono<{ Bindings: Bindings }>();

// This is private, eventually
sessionsRoute.get("/", async (c) => {
	const { userId } = c.req.query();
	if (!userId) {
		return badRequest("No user id query param provided");
	}
	const db = createDrizzleForTurso(c.env);
	const userSessions = await db
		.select()
		.from(sessions)
		.where(eq(sessions.userId, userId));

	return c.json(userSessions);
});

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

sessionsRoute.patch("/:sessionId", async (c) => {
	const sessionId = c.req.param("sessionId");
	const db = createDrizzleForTurso(c.env);
	const sessionUpdateData = await zx.parseForm(
		c.req.raw,
		sessionInsertSchema.partial(),
	);
	const updatedSession = await db
		.update(sessions)
		.set(sessionUpdateData)
		.where(eq(sessions.id, sessionId))
		.returning();

	return c.json(updatedSession);
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
