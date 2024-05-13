import { DB, Faction, Session, charactersInFactions } from "@repo/db";
import { eq } from "drizzle-orm";

export const getCharacterFactions = async (
	db: DB,
	characterId: string,
): Promise<Faction[]> => {
	const result = await db.query.charactersInFactions.findMany({
		where: eq(charactersInFactions.characterId, characterId),
		with: {
			faction: true,
		},
	});

	return result.map((row) => row.faction);
};

export const getCharacterSessions = async (
	db: DB,
	characterId: string,
): Promise<Session[]> => {
	const result = await db.query.charactersInSessions.findMany({
		where: eq(charactersInFactions.characterId, characterId),
		with: {
			session: true,
		},
	});

	return result.map((row) => row.session);
};
