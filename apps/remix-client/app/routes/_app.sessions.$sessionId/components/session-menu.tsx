import { useSubmit } from "@remix-run/react";
import { MenuTrigger, SubmenuTrigger } from "react-aria-components";
import type { Key } from "react-stately";
import { EntitySelectCard } from "~/components/entity-select-card";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Menu, MenuItem } from "~/components/ui/menu";
import { Modal } from "~/components/ui/modal";
import { useAppData } from "~/routes/_app/route";
import { useState } from "react";
import { type EntityType, LINK_INTENT } from "@repo/db";
import { CopyIcon, Share1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useSessionRouteData } from "../route";

export function SessionMenu({ sessionId }: { sessionId: string }) {
	const submit = useSubmit();

	// State for the links modal
	const [isOpen, setIsOpen] = useState(false);
	const [linkType, setLinkType] = useState<EntityType>("factions");

	const handleLinkFactionsClicked = () => {
		setIsOpen(true);
		setLinkType("factions");
	};
	const handleLinkCharactersClicked = () => {
		setIsOpen(true);
		setLinkType("characters");
	};
	const handleLinkNotesClicked = () => {
		setIsOpen(true);
		setLinkType("notes");
	};

	return (
		<>
			<MenuTrigger>
				<Button aria-label="Session Options">Menu</Button>
				<Menu>
					<MenuItem
						onAction={() =>
							submit({}, { method: "DELETE", action: `/sessions/${sessionId}` })
						}
					>
						<TrashIcon className="mr-3" />
						<span>Delete</span>
					</MenuItem>
					<MenuItem>
						<CopyIcon className="mr-3" />
						<span>Duplicate (inactive)</span>
					</MenuItem>
					<SubmenuTrigger>
						<MenuItem>
							<Share1Icon className="mr-3" />
							<span>Links..</span>
						</MenuItem>
						<Menu>
							<MenuItem onAction={handleLinkFactionsClicked}>Factions</MenuItem>
							<MenuItem onAction={handleLinkNotesClicked}>Notes</MenuItem>
							<MenuItem onAction={handleLinkCharactersClicked}>Characters</MenuItem>
						</Menu>
					</SubmenuTrigger>
				</Menu>
			</MenuTrigger>
			<LinkModal
				sessionId={sessionId}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				linkType={linkType}
			/>
		</>
	);
}

interface LinkModalProps {
	sessionId: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	linkType: EntityType;
}
function LinkModal({ sessionId, isOpen, setIsOpen, linkType }: LinkModalProps) {
	const { allFactions, allNotes, allCharacters } = useAppData();
	const { session } = useSessionRouteData();

	const initFactions = new Set(session.factions.map((f) => f.factionId as Key));
	const initNotes = new Set(session.notes.map((f) => f.noteId as Key));
	const initChars = new Set(session.characters.map((f) => f.characterId as Key));

	const [linkedFactions, setLinkedFactions] = useState(initFactions);
	const [linkedNotes, setLinkedNotes] = useState(initNotes);
	const [linkedChars, setLinkedChars] = useState(initChars);

	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<Dialog>
				{({ close }) => (
					<>
						{linkType === "factions" ? (
							<EntitySelectCard
								targetEntityId={sessionId}
								targetEntityType={linkType}
								allEntities={allFactions}
								selectedEntities={linkedFactions}
								setSelectedEntites={setLinkedFactions}
								intent={LINK_INTENT.FACTIONS}
								action=""
								close={close}
							/>
						) : linkType === "notes" ? (
							<EntitySelectCard
								targetEntityId={sessionId}
								targetEntityType={linkType}
								allEntities={allNotes}
								selectedEntities={linkedNotes}
								setSelectedEntites={setLinkedNotes}
								intent={LINK_INTENT.NOTES}
								action=""
								close={close}
							/>
						) : (
							<EntitySelectCard
								targetEntityId={sessionId}
								targetEntityType={linkType}
								allEntities={allCharacters}
								selectedEntities={linkedChars}
								setSelectedEntites={setLinkedChars}
								intent={LINK_INTENT.CHARACTERS}
								action=""
								close={close}
							/>
						)}
					</>
				)}
			</Dialog>
		</Modal>
	);
}
