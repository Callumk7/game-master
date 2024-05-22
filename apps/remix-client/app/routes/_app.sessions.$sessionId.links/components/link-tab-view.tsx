import type { Character, Faction, Location, Note } from "@repo/db";
import { RenderHtml } from "~/components/render-html";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Tab, TabList, TabPanel, Tabs } from "~/components/ui/tabs";

interface LinkTabsViewProps {
	characters: Character[];
	factions: Faction[];
}

export function LinkTabsView({ characters, factions }: LinkTabsViewProps) {
	return (
		<Tabs>
			<TabList>
				<Tab id="characters">Characters</Tab>
				<Tab id="factions">Factions</Tab>
				<Tab id="locations">Locations</Tab>
			</TabList>
			<TabPanel id="characters">
				{characters.map((char) => (
					<CharacterCard character={char} />
				))}
			</TabPanel>
			<TabPanel id="factions">
				<div>Faction Panel</div>
			</TabPanel>
			<TabPanel id="locations">
				<div>Location Panel</div>
			</TabPanel>
		</Tabs>
	);
}

interface CharacterCardProps {
	character: Character;
	note?: Note;
}

export function CharacterCard({ character, note }: CharacterCardProps) {
	return (
		<div>
			<Header style="h4">{character.name}</Header>
			{note ? <RenderHtml content={note.htmlContent} /> : <Button>Create Note</Button>}
		</div>
	);
}
