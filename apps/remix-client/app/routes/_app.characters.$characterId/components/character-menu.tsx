import { useFetcher, useSubmit } from "@remix-run/react";
import { MenuTrigger, SubmenuTrigger } from "react-aria-components";
import type { Key } from "react-stately";
import { EntitySelectCard } from "~/components/entity-select-card";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Menu, MenuItem } from "~/components/ui/menu";
import { Modal } from "~/components/ui/modal";
import { useAppData } from "~/routes/_app/route";
import { useCharacterRouteData } from "../route";
import { useState } from "react";
import { type EntityType, LINK_INTENT } from "@repo/db";
import { CopyIcon, MagicWandIcon, Share1Icon, TrashIcon } from "@radix-ui/react-icons";

export function CharacterMenu({
	characterId,
	characterName,
}: { characterId: string; characterName: string }) {
	const submit = useSubmit();

	// State for the links modal
	const [isOpen, setIsOpen] = useState(false);
	const [linkType, setLinkType] = useState<EntityType>("factions");

	const handleLinkFactionsClicked = () => {
		setIsOpen(true);
		setLinkType("factions");
	};
	const handleLinkSessionsClicked = () => {
		setIsOpen(true);
		setLinkType("sessions");
	};
	const handleLinkNotesClicked = () => {
		setIsOpen(true);
		setLinkType("notes");
	};

	const fetcher = useFetcher();

	return (
		<>
			<MenuTrigger>
				<Button aria-label="Character Options">Menu</Button>
				<Menu>
					<MenuItem
						onAction={() =>
							submit({}, { method: "DELETE", action: `/characters/${characterId}` })
						}
					>
						<TrashIcon className="mr-3" />
						<span>Delete</span>
					</MenuItem>
					<MenuItem isDisabled>
						<CopyIcon className="mr-3" />
						<span>Duplicate</span>
					</MenuItem>
					<SubmenuTrigger>
						<MenuItem>
							<Share1Icon className="mr-3" />
							<span>Links..</span>
						</MenuItem>
						<Menu>
							<MenuItem onAction={handleLinkFactionsClicked}>Factions</MenuItem>
							<MenuItem onAction={handleLinkNotesClicked}>Notes</MenuItem>
							<MenuItem onAction={handleLinkSessionsClicked}>Sessions</MenuItem>
						</Menu>
					</SubmenuTrigger>
					<MenuItem
            isDisabled
						onAction={() =>
							fetcher.submit(
								{ characterName: characterName },
								{ method: "POST", encType: "application/json" },
							)
						}
					>
						<MagicWandIcon className="mr-3" />
						<span>Generate Bio (experimental)</span>
					</MenuItem>
				</Menu>
			</MenuTrigger>
			<LinkModal
				characterId={characterId}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				linkType={linkType}
			/>
		</>
	);
}

interface LinkModalProps {
	characterId: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	linkType: EntityType;
}
function LinkModal({ characterId, isOpen, setIsOpen, linkType }: LinkModalProps) {
	const { allFactions, allNotes, allSessions } = useAppData();
	const { characterData } = useCharacterRouteData();

	const initFactions = new Set(characterData.factions.map((f) => f.factionId as Key));
	const initNotes = new Set(characterData.notes.map((f) => f.noteId as Key));
	const initSessions = new Set(characterData.sessions.map((f) => f.sessionId as Key));

	const [linkedFactions, setLinkedFactions] = useState(initFactions);
	const [linkedNotes, setLinkedNotes] = useState(initNotes);
	const [linkedSessions, setLinkedSessions] = useState(initSessions);

	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
			<Dialog>
				{({ close }) => (
					<>
						{linkType === "factions" ? (
							<EntitySelectCard
								targetEntityId={characterId}
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
								targetEntityId={characterId}
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
								targetEntityId={characterId}
								targetEntityType={linkType}
								allEntities={allSessions}
								selectedEntities={linkedSessions}
								setSelectedEntites={setLinkedSessions}
								intent={LINK_INTENT.SESSIONS}
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
