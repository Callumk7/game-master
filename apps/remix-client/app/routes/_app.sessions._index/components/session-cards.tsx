import type { Character, Faction, Note, Session } from "@repo/db";
import { Card } from "~/components/card";
import { EntityListBox } from "~/components/entity-listbox";
import { Header, HeaderLink } from "~/components/typeography";

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
			<HeaderLink
				to={`/sessions/${session.id}`}
				style="h3"
				colour="primary"
				className="underline decoration-amber-10"
			>
				{session.name}
			</HeaderLink>
			<div className={`grid grid-cols-${cols} gap-3`}>
				{notes.length > 0 && (
					<div>
						<Header style="h5" className="mb-2">
							Notes
						</Header>
						<EntityListBox items={notes} type="notes" />
					</div>
				)}
				{characters.length > 0 && (
					<div>
						<Header style="h5" className="mb-2">
							Characters
						</Header>
						<EntityListBox items={characters} type="characters" />
					</div>
				)}
				{factions.length > 0 && (
					<div>
						<Header style="h5" className="mb-2">
							Factions
						</Header>
						<EntityListBox items={factions} type="factions" />
					</div>
				)}
			</div>
		</Card>
	);
}
