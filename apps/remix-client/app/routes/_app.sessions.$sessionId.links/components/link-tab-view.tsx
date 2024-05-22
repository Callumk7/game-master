import { useSubmit } from "@remix-run/react";
import type {
	Character,
	CharactersInSessionsWithCharacterNote,
	Faction,
	FactionsInSessionsWithFactionNote,
	Location,
	Note,
} from "@repo/db";
import { useState } from "react";
import { RenderHtml } from "~/components/render-html";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Tab, TabList, TabPanel, Tabs } from "~/components/ui/tabs";
import { TextField } from "~/components/ui/text-field";

interface LinkTabsViewProps {
	sessionName: string;
	characters: CharactersInSessionsWithCharacterNote[];
	factions: FactionsInSessionsWithFactionNote[];
}

export function LinkTabsView({ sessionName, characters, factions }: LinkTabsViewProps) {
	return (
		<Tabs>
			<TabList>
				<Tab id="characters">Characters</Tab>
				<Tab id="factions">Factions</Tab>
				<Tab id="locations">Locations</Tab>
			</TabList>
			<TabPanel id="characters">
				{characters.map((char) => (
					<CharacterCard
						sessionName={sessionName}
						key={char.characterId}
						character={char.character}
						note={char.note}
					/>
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
	note?: Note | null;
	sessionName: string;
}

export function CharacterCard({ character, note, sessionName }: CharacterCardProps) {
	const [isCreatingNote, setIsCreatingNote] = useState(false);
	const [noteContent, setNoteContent] = useState("");
	return (
		<div className="space-y-3">
			<Header style="h4">{character.name}</Header>
			{note ? (
				<RenderHtml content={note.htmlContent} />
			) : isCreatingNote ? (
				<CreateCharacterNote
					characterName={character.name}
					sessionName={sessionName}
					characterId={character.id}
					noteContent={noteContent}
					setNoteContent={setNoteContent}
					setIsCreatingNote={setIsCreatingNote}
				/>
			) : (
				<Button onPress={() => setIsCreatingNote(true)} size="sm" variant="outline">
					Create Note
				</Button>
			)}
		</div>
	);
}

function CreateCharacterNote({
	characterName,
	sessionName,
	characterId,
	noteContent,
	setNoteContent,
	setIsCreatingNote,
}: {
	characterName: string;
	sessionName: string;
	characterId: string;
	noteContent: string;
	setNoteContent: (content: string) => void;
	setIsCreatingNote: (creatingNote: boolean) => void;
}) {
	const submit = useSubmit();
	const handleSave = () => {
		setIsCreatingNote(false);
		submit(
			{
				htmlContent: noteContent,
				linkId: characterId,
				linkType: "characters",
				name: `${characterName} notes on ${sessionName}`,
			},
			{ method: "POST" },
		);
	};
	return (
		<div className="space-y-2">
			<TextField
				label="Note"
				name="content"
				textarea
				value={noteContent}
				onInput={(e) => setNoteContent(e.currentTarget.value)}
			/>
			<Button size="sm" onPress={handleSave}>
				Save
			</Button>
		</div>
	);
}
