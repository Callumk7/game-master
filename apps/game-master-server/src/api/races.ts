import { json } from "@remix-run/cloudflare";
import { uuidv4 } from "callum-util";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";
import { DB } from "~/db";
import { races } from "~/db/schemas/characters";
import { RaceInsert } from "~/types";

export const createRace = async (db: DB, request: Request) => {
	// This throws
	const data = await zx.parseForm(request, {
		name: z.string(),
		description: z.string().optional(),
	});

	const newRace: RaceInsert = {
		id: `race_${uuidv4()}`,
		name: data.name,
		description: data.description,
	};

	try {
		const result = await insertRaceToDB(db, newRace);
		return json({ race: result });
	} catch (err) {
		console.error(err);
	}

	return json("Failed to create race", {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
	});
};

export const insertRaceToDB = async (db: DB, newRace: RaceInsert) => {
	const result = await db
		.insert(races)
		.values(newRace)
		.onConflictDoNothing()
		.returning();
	return result[0];
};

export const getAllRaces = async (db: DB) => {
	return await db.select().from(races);
};
