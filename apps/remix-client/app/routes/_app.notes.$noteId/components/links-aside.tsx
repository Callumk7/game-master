import { PlusCircledIcon } from "@radix-ui/react-icons";
import { type Character, type Faction, LINK_INTENT, type Session } from "@repo/db";
import { useState } from "react";
import { DialogTrigger, type Key } from "react-aria-components";
import { Card } from "~/components/card";
import { EntitySelectCard } from "~/components/entity-select-card";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Link } from "~/components/ui/link";
import { Modal } from "~/components/ui/modal";
import { Separator } from "~/components/ui/separator";
import { Tab, TabList, TabPanel, Tabs } from "~/components/ui/tabs";
import { useAppData } from "~/routes/_app/route";
import { useNoteIdLoaderData } from "../route";

interface LinksAsideProps {
	characters: Character[];
	factions: Faction[];
	sessions: Session[];
}

export function LinksAside({ characters, factions, sessions }: LinksAsideProps) {
  if (characters.length === 0 && factions.length === 0 && sessions.length === 0) return null
	return (
		<div className="pl-7 space-y-7">
			<Card>
				<div className="flex justify-between items-center mb-2 w-full">
					<Header style="h3">Links</Header>
					<AddLinkModal />
				</div>
				<Separator />
				{characters.length > 0 && (
					<>
						<h2 className="my-3 text-lg font-semibold">Characters</h2>
						<ul className="flex flex-col gap-2">
							{characters.map((char) => (
								<li key={char.id}>
									<Link href={`/characters/${char.id}`}>{char.name}</Link>
								</li>
							))}
						</ul>
					</>
				)}
				{factions.length > 0 && (
					<>
						<h2 className="my-3 text-lg font-semibold">Factions</h2>
						<ul className="flex flex-col gap-2">
							{factions.map((faction) => (
								<li key={faction.id}>
									<Link href={`/factions/${faction.id}`}>{faction.name}</Link>
								</li>
							))}
						</ul>
					</>
				)}
				{sessions.length > 0 && (
					<>
						<h2 className="my-3 text-lg font-semibold">Sessions</h2>
						<ul className="flex flex-col gap-2">
							{sessions.map((sesh) => (
								<li key={sesh.id}>
									<Link href={`/sessions/${sesh.id}`}>{sesh.name}</Link>
								</li>
							))}
						</ul>
					</>
				)}
			</Card>
		</div>
	);
}

function AddLinkModal() {
	const { noteData } = useNoteIdLoaderData();
	const { allCharacters, allFactions, allSessions } = useAppData();
	const [characters, setCharacters] = useState(
		new Set(noteData.characters.map((c) => c.characterId as Key)),
	);
	return (
		<DialogTrigger>
			<Button variant="ghost" size="icon-sm">
				<PlusCircledIcon />
			</Button>
			<Modal width="wide" height="fixed">
				<Dialog>
					<Header style="h3">Add Links</Header>
					<Tabs>
						<TabList>
							<Tab id="char">Characters</Tab>
							<Tab id="fact">Factions</Tab>
						</TabList>
						<TabPanel id="char">
							<EntitySelectCard
								targetEntityId={noteData.id}
								targetEntityType={"characters"}
								allEntities={allCharacters}
								selectedEntities={characters}
								setSelectedEntites={setCharacters}
								intent={LINK_INTENT.CHARACTERS}
								action=""
							/>
						</TabPanel>
						<TabPanel id="fact">fact</TabPanel>
					</Tabs>
				</Dialog>
			</Modal>
		</DialogTrigger>
	);
}
