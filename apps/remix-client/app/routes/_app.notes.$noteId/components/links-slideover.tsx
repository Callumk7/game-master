import type { Key } from "react-aria-components";
import { useState } from "react";
import { useNoteIdLoaderData } from "~/routes/_app.notes.$noteId/route";
import { useStateSync } from "~/hooks/sync-state";
import { useAppData } from "~/routes/_app/route";
import { Button } from "~/components/ui/button";
import { SlideOver } from "~/components/slideover";
import { Dialog } from "~/components/ui/dialog";
import { EntitySelectCard } from "~/components/entity-select-card";
import { LINK_INTENT } from "@repo/db";

interface NotesLinksSlideOverProps {
	className?: string;
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
}
export function NoteLinksSlideOver({
	isSidebarOpen,
	setIsSidebarOpen,
}: NotesLinksSlideOverProps) {
	const { allCharacters, allFactions, allSessions } = useAppData();
	const { noteData } = useNoteIdLoaderData();

	const initChars = new Set(noteData.characters.map((c) => c.characterId as Key));
	const initFactions = new Set(noteData.factions.map((f) => f.factionId as Key));
	const initSessions = new Set(noteData.sessions.map((s) => s.sessionId as Key));

	const [linkedCharacters, setLinkedCharacters] = useState(initChars);
	const [linkedFactions, setLinkedFactions] = useState(initFactions);
	const [linkedSessions, setLinkedSessions] = useState(initSessions);

	useStateSync(noteData.id, () => {
		setLinkedCharacters(initChars);
		setLinkedFactions(initFactions);
		setLinkedSessions(initSessions);
	});

	return (
		<SlideOver
			isDismissable
			size="narrow"
			isOpen={isSidebarOpen}
			onOpenChange={setIsSidebarOpen}
		>
			<Dialog>
				{({ close }) => (
					<div className="space-y-5">
						<Button onPress={() => close()}>Close</Button>
						<EntitySelectCard
							targetEntityId={noteData.id}
							targetEntityType={"notes"}
							allEntities={allCharacters}
							selectedEntities={linkedCharacters}
							setSelectedEntites={setLinkedCharacters}
							intent={LINK_INTENT.CHARACTERS}
							action=""
						/>
						<EntitySelectCard
							targetEntityId={noteData.id}
							targetEntityType={"notes"}
							allEntities={allFactions}
							selectedEntities={linkedFactions}
							setSelectedEntites={setLinkedFactions}
							intent={LINK_INTENT.FACTIONS}
							action=""
						/>
						<EntitySelectCard
							targetEntityId={noteData.id}
							targetEntityType={"notes"}
							allEntities={allSessions}
							selectedEntities={linkedSessions}
							setSelectedEntites={setLinkedSessions}
							intent={LINK_INTENT.SESSIONS}
							action=""
						/>
					</div>
				)}
			</Dialog>
		</SlideOver>
	);
}
