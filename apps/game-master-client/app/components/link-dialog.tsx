import { Character, Faction, Note } from "@repo/api";
import { ReactNode } from "react";
import { EntityType } from "~/types/general";
import {
	DialogContent,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Tab, TabList, TabPanel, Tabs } from "./ui/tabs";
import { EntityListBox } from "./entity-list-box";

interface LinkDialogProps {
	entityId: string;
	entityType: EntityType;
	allNotes: Note[];
	allChars: Character[];
	allFactions: Faction[];
	trigger: ReactNode;
}

export function LinkDialog({
	entityId,
	entityType,
	allNotes,
	allChars,
	allFactions,
	trigger,
}: LinkDialogProps) {
	return (
		<DialogTrigger>
			{trigger}
			<DialogOverlay>
				<DialogContent>
					{({ close }) => (
						<>
							<DialogHeader>
								<DialogTitle>Link</DialogTitle>
							</DialogHeader>
							<div>
								<Tabs>
									<TabList>
										<Tab id="notes">Notes</Tab>
										<Tab id="chars">Characters</Tab>
										<Tab id="factions">Factions</Tab>
									</TabList>
									<TabPanel id="notes">
										<EntityListBox items={allNotes} entityType="notes" />
									</TabPanel>
								</Tabs>
							</div>
						</>
					)}
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}
