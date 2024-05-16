import { and, eq } from "drizzle-orm";
import { DB } from "../db";
import { characters, races } from "../db/schemas/characters";
import { factions } from "../db/schemas/factions";
import { notes, folders } from "../db/schemas/notes";
import { plots } from "../db/schemas/plots";
import { sessions } from "../db/schemas/sessions";

export const getAllUserEntities = async (db: DB, userId: string) => {
	const unsortedNotesPromise = db.query.notes.findMany({
		where: and(
			eq(notes.userId, userId),
			eq(notes.isLinkNote, false),
			eq(notes.folderId, "NONE"),
		),
	});

	const allFoldersPromise = db.query.folders.findMany({
		where: eq(folders.userId, userId),
		with: {
			notes: true,
		},
	});
	const allPlotsPromise = db.select().from(plots).where(eq(plots.userId, userId));
	const allCharactersPromise = db
		.select()
		.from(characters)
		.where(eq(characters.userId, userId));
	const allFactionsPromise = db
		.select()
		.from(factions)
		.where(eq(factions.userId, userId));
	const allSessionsPromise = db
		.select()
		.from(sessions)
		.where(eq(sessions.userId, userId));
	const allRacesPromise = db.select().from(races).where(eq(races.userId, userId));

	const [
		unsortedNotes,
		allFolders,
		allCharacters,
		allFactions,
		allPlots,
		allSessions,
		allRaces,
	] = await Promise.all([
		unsortedNotesPromise,
		allFoldersPromise,
		allCharactersPromise,
		allFactionsPromise,
		allPlotsPromise,
		allSessionsPromise,
		allRacesPromise,
	]);

	const allNotes = unsortedNotes.concat(allFolders.flatMap((folder) => folder.notes));

	return {
		allNotes,
		unsortedNotes,
		allFolders,
		allCharacters,
		allFactions,
		allPlots,
		allSessions,
		allRaces,
	};
};
