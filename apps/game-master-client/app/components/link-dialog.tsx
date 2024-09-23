import type { BasicEntity, EntityType } from "@repo/api";
import type { ReactNode } from "react";
import {
	DialogContent,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Tab, TabList, TabPanel, Tabs } from "./ui/tabs";
import { useGameData } from "~/routes/_app.games.$gameId/route";
import { GridList, GridListItem } from "./ui/grid-list";

interface LinkDialogProps {
	entityId: string;
	entityType: EntityType;
	trigger: ReactNode;
}

export function LinkDialog({ entityId, entityType, trigger }: LinkDialogProps) {
	const { notes, characters, factions } = useGameData();
	return (
		<DialogTrigger>
			{trigger}
			<DialogOverlay>
				<DialogContent>
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
								<EntityGridBox items={notes} />
							</TabPanel>
							<TabPanel id="chars">
								<EntityGridBox items={characters} />
							</TabPanel>
							<TabPanel id="factions">
								<EntityGridBox items={factions} />
							</TabPanel>
						</Tabs>
					</div>
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}

interface EntityGridBoxProps {
	items: BasicEntity[];
}

export function EntityGridBox({ items }: EntityGridBoxProps) {
	return (
		<GridList items={items} selectionMode="multiple">
			{(item) => <GridListItem>{item.name}</GridListItem>}
		</GridList>
	);
}
