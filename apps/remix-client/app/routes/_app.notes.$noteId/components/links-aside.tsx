import { Character, Faction, Session } from "@repo/db";
import { Card } from "~/components/card";
import { EntityGridBox } from "~/components/entity-gridbox";
import { EntityListBox } from "~/components/entity-listbox";
import { Header } from "~/components/typeography";

interface LinksAsideProps {
	characters: Character[];
	factions: Faction[];
	sessions: Session[];
}

export function LinksAside({ characters, factions, sessions }: LinksAsideProps) {
	return (
		<div>
			<Card>
				<Header style="h3">Characters</Header>
				<EntityGridBox items={characters} contentType="characters" type="notes" />
			</Card>
		</div>
	);
}
