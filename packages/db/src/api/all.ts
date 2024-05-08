import { and, eq } from "drizzle-orm";
import { DB } from "~/db";
import { notes, folders, plots, characters, factions, sessions } from "~/db/schemas";

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

	const [unsortedNotes, allFolders, allCharacters, allFactions, allPlots, allSessions] =
		await Promise.all([
			unsortedNotesPromise,
			allFoldersPromise,
			allCharactersPromise,
			allFactionsPromise,
			allPlotsPromise,
			allSessionsPromise,
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
	};
};
