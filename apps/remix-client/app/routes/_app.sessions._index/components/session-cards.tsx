import type { Character, Faction, Note, Session } from "@repo/db";
import { Card } from "~/components/card";
import { EntityListBox } from "~/components/entity-listbox";
import { Header } from "~/components/typeography";

interface SessionCardProps {
	session: Session;
	notes: Note[];
	characters: Character[];
	factions: Faction[];
}

export function SessionCard({ session, notes, characters, factions }: SessionCardProps) {
	let cols = 0;
	if (notes.length > 0) cols++;
	if (characters.length > 0) cols++;
	if (factions.length > 0) cols++;
	return (
		<Card>
			<Header style="h3">{session.name}</Header>
			<div className={`grid grid-cols-${cols}`}>
				{notes.length > 0 && <EntityListBox items={notes} type="notes" />}
				{characters.length > 0 && <EntityListBox items={characters} type="characters" />}
				{factions.length > 0 && <EntityListBox items={factions} type="factions" />}
			</div>
		</Card>
	);
}
