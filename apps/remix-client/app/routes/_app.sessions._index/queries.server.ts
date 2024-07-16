import { type DB, sessions } from "@repo/db";
import { eq } from "drizzle-orm";

export const getSessionsWithLinkData = async (db: DB, userId: string) => {
	const result = await db.query.sessions.findMany({
		where: eq(sessions.userId, userId),
		with: {
			characters: { with: { character: true } },
			factions: { with: { faction: true } },
			notes: { with: { note: true } },
		},
	});

	const sessionData = result.map((session) => ({
		...session,
		characters: session.characters.map((c) => c.character),
		factions: session.factions.map((f) => f.faction),
		notes: session.notes.map((n) => n.note),
	}));

	return sessionData;
};
