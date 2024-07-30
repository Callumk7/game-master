import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";

const notesApp = new Hono();

// We are going to break down the app into smaller modules
// that should be easier to reason about and work independent 
// of each other

const getNotesSchema = z.object({
	userId: z.string(),
})
notesApp.get("/", zValidator("json", getNotesSchema), async (c) => {
	const { userId } = c.req.valid("json");

	const results = await getUserNotes(userId, options);

	// pagination etc
	// caching etc
	// better system etc
})
