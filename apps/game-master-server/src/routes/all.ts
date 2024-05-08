import { Hono } from "hono";
import { Bindings } from "..";
import { userIdValidator } from "~/lib/validators";
import { createDrizzleForTurso } from "~/db";
import { getAllUserEntities } from "~/api";

export const allEntitiesRoute = new Hono<{ Bindings: Bindings }>();

allEntitiesRoute.post("/", async (c) => {
	const form = await c.req.formData();
	const userId = String( form.get("userId") );
	const db = createDrizzleForTurso(c.env);
	const allUserEntities = await getAllUserEntities(db, userId);
	return c.json({
		...allUserEntities,
	});
});
