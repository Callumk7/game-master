import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	notes,
	folders,
	linkedNotes,
	characters,
	races,
	allies,
	enemies,
	factions,
	charactersInFactions,
	plots,
	sessions,
	charactersInSessions,
	factionsInSessions,
	plotsInSessions,
} from "../db/schemas";

export * from "./http";

// AI types
type AiMessageRole = "user" | "system" | "assistant";

type AiMessage = {
	content: string;
	role: AiMessageRole;
};

export type { AiMessage, AiMessageRole };

// Custom Types
export type EntityType = "characters" | "factions" | "plots" | "notes" | "sessions";
export const EntityTypeSchema = z.enum([
	"characters",
	"factions",
	"sessions",
	"plots",
	"notes",
]);
export type BasicEntity = { id: string; name: string };
export type FilterableEntity = BasicEntity & {
	characters: BasicEntity[];
	factions: BasicEntity[];
	sessions: BasicEntity[];
};
export const OptionalEntitySchema = z.array(z.string()).or(z.string()).optional();
export type MultiSelectString = z.infer<typeof OptionalEntitySchema>;

// Drizzle zod schemas, and inferred types
export const notesInsertSchema = createInsertSchema(notes);
export const notesSelectSchema = createSelectSchema(notes);

export type Note = z.infer<typeof notesSelectSchema>;
export type NoteInsert = z.infer<typeof notesInsertSchema>;

export const foldersInsertSchema = createInsertSchema(folders);
export const foldersSelectSchema = createSelectSchema(folders);

export type Folder = z.infer<typeof foldersSelectSchema>;
export type FolderInsert = z.infer<typeof notesInsertSchema>;

export type NoteWithFolder = Note & {
	folder: Folder | null;
};
export type FolderWithNotes = Folder & {
	notes: Note[];
};

export const linkedNotesInsertSchema = createInsertSchema(linkedNotes);
export const linkedNotesSelectSchema = createSelectSchema(linkedNotes);

export type LinkedNote = z.infer<typeof linkedNotesSelectSchema>;
export type LinkedNoteInsert = z.infer<typeof linkedNotesInsertSchema>;

export const charactersInsertSchema = createInsertSchema(characters);
export const createCharacterRequest = charactersInsertSchema.omit({ id: true });
export const characersSelectSchema = createSelectSchema(characters);

export type Character = z.infer<typeof characersSelectSchema>;
export type CharacterInsert = z.infer<typeof charactersInsertSchema>;

export const racesInsertSchema = createInsertSchema(races);
export const racesSelectSchema = createSelectSchema(races);

export type Race = z.infer<typeof racesSelectSchema>;
export type RaceInsert = z.infer<typeof racesInsertSchema>;

export const alliesInsertSchema = createInsertSchema(allies);
export const enemiesInsertSchema = createInsertSchema(enemies);
export type AllyInsert = z.infer<typeof alliesInsertSchema>;
export type EnemyInsert = z.infer<typeof enemiesInsertSchema>;

export const factionInsertSchema = createInsertSchema(factions);
export const factionSelectSchema = createSelectSchema(factions);
export const createFactionRequest = factionInsertSchema.omit({ id: true });

export type Faction = z.infer<typeof factionSelectSchema>;
export type FactionInsert = z.infer<typeof factionInsertSchema>;

export const charactersInFactionsInsertSchema = createInsertSchema(charactersInFactions);
export const charactersInFactionsSelectSchema = createSelectSchema(charactersInFactions);

export type CharactersInFactions = z.infer<typeof charactersInFactionsSelectSchema>;
export type CharactersInFactionsInsert = z.infer<typeof charactersInFactionsInsertSchema>;

export const plotInsertSchema = createInsertSchema(plots);
export const plotSelectSchema = createSelectSchema(plots);

export type Plot = z.infer<typeof plotSelectSchema>;
export type NamedPlot = Plot & {
	name: string;
};
export type PlotInsert = z.infer<typeof plotInsertSchema>;

export const sessionInsertSchema = createInsertSchema(sessions);
export const sessionSelectSchema = createSelectSchema(sessions);
export const charactersInSessionsInsertSchema = createInsertSchema(charactersInSessions);
export const charactersInSessionsSelectSchema = createSelectSchema(charactersInSessions);
export const factionsInSessionsInsertSchema = createInsertSchema(factionsInSessions);
export const factionsInSessionsSelectSchema = createSelectSchema(factionsInSessions);
export const plotsInSessionsInsertSchema = createInsertSchema(plotsInSessions);
export const plotsInSessionsSelectSchema = createSelectSchema(plotsInSessions);

export type Session = z.infer<typeof sessionSelectSchema>;
export type SessionInsert = z.infer<typeof sessionInsertSchema>;
export type CharactersInSessions = z.infer<typeof charactersInSessionsSelectSchema>;
export type CharactersInSessionsInsert = z.infer<typeof charactersInSessionsInsertSchema>;
export type FactionsInSessions = z.infer<typeof factionsInSessionsSelectSchema>;
export type FactionsInSessionsInsert = z.infer<typeof factionsInSessionsInsertSchema>;
export type PlotsInSessions = z.infer<typeof plotsInSessionsSelectSchema>;
export type PlotsInSessionsInsert = z.infer<typeof plotsInSessionsInsertSchema>;

// export const logInsertSchema = createInsertSchema(logs);
// export const logSelectSchema = createSelectSchema(logs);
//
// export type Log = z.infer<typeof logSelectSchema>;
// export type LogInsert = z.infer<typeof logInsertSchema>;

// Composite types
export type CharacterWithRace = Character & {
	race: Race;
};
export type CharacterWithRaceAndFactions = CharacterWithRace & {
	factions: (Faction | null)[];
};
export type CompleteNote = Note & {
	characters: Character[];
	factions: Faction[];
	sessions: Session[];
	plots: Plot[];
};
export type SessionWithCompleteNotes = Session & {
	notes: CompleteNote[];
};
export type CharacterInFaction = CharactersInFactions & {
	faction: Faction | null;
};
