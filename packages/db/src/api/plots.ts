import { eq } from "drizzle-orm";
import { DB } from "../db";
import { plotsOnCharacters, plots } from "../db/schemas/plots";
import { MultiSelectString, Plot } from "../types";
import { LINK_INTENT } from "./util";
import { handleLinkingByIntent } from "./generic";

export const getCharacterPlots = async (db: DB, characterId: string) => {
	return await db.query.plotsOnCharacters.findMany({
		where: eq(plotsOnCharacters.characterId, characterId),
	});
};

export const updatePlot = async (db: DB, update: Partial<Plot>, plotId: string) => {
	const result = await db
		.update(plots)
		.set(update)
		.where(eq(plots.id, plotId))
		.returning();
	return result[0];
};
