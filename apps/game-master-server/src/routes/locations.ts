import { Hono } from "hono";
import { Bindings } from "..";
import {
	LocationInsert,
	createDrizzleForTurso,
	locationInsertSchema,
	locations,
	notFound,
} from "@repo/db";
import { eq } from "drizzle-orm";
import { zx } from "zodix";
import { uuidv4 } from "callum-util";

export const locationsRoute = new Hono<{ Bindings: Bindings }>();

// ALL locations (not user specific)
locationsRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allLocations = await db.select().from(locations);
	return c.json({ locations: allLocations });
});

locationsRoute.get("/:locationId", async (c) => {
	const locationId = c.req.param("locationId");
	const db = createDrizzleForTurso(c.env);
	const location = await db
		.select()
		.from(locations)
		.where(eq(locations.id, locationId));

	if (location.length === 0) {
		return notFound();
	}

	return c.json({ location: location[0] });
});

locationsRoute.post("/", async (c) => {
	const newLocationBody = await zx.parseForm(
		c.req.raw,
		locationInsertSchema.omit({ id: true }),
	);

	const newLocationInsert: LocationInsert = {
		id: `loc_${uuidv4()}`,
		...newLocationBody,
	};

	const db = createDrizzleForTurso(c.env);
	const newLocation = await db.insert(locations).values(newLocationInsert).returning();

	return c.json({ newLocation });
});
