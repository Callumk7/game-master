import { DB, races } from "@repo/db";
import { eq } from "drizzle-orm";

export const getRaceId = async (db: DB, raceName: string, userId: string) => {
	const allRaces = await db
		.select({ id: races.id, name: races.name })
		.from(races)
		.where(eq(races.userId, userId));

	return allRaces.find((race) => race.name === raceName);
};
