import type { BasicEntity } from "@repo/api";
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
import { useListData } from "react-stately";
import type { GridListProps } from "react-aria-components";
import { useFetcher } from "@remix-run/react";
import { appendFormWithArray } from "~/util/form-array";

interface LinkDialogProps {
	trigger: ReactNode;
	linkedNotes: BasicEntity[];
	linkedChars: BasicEntity[];
	linkedFactions: BasicEntity[];
}

export function LinkDialog({
	trigger,
	linkedNotes,
	linkedChars,
	linkedFactions,
}: LinkDialogProps) {
	const { notes, characters, factions } = useGameData(); // full list of game entities

	const notesState = useListData({
		initialItems: notes,
		initialSelectedKeys: linkedNotes.map((note) => note.id),
	});
	const charactersState = useListData({
		initialItems: characters,
		initialSelectedKeys: linkedChars.map((char) => char.id),
	});
	const factionsState = useListData({
		initialItems: factions,
		initialSelectedKeys: linkedFactions.map((faction) => faction.id),
	});

	const fetcher = useFetcher();
	const handleSaveOnClosed = (isOpen: boolean) => {
		if (isOpen === false) {
			const form = new FormData();

			if (charactersState.selectedKeys !== "all") {
				appendFormWithArray(form, charactersState.selectedKeys, "characterIds");
			}

			if (factionsState.selectedKeys !== "all") {
				appendFormWithArray(form, factionsState.selectedKeys, "factionIds");
			}

      fetcher.submit(form, { method: "PUT" });
		}
	};

	return (
		<DialogTrigger onOpenChange={handleSaveOnClosed}>
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
								<EntityGridBox
									items={notesState.items}
									selectionMode="multiple"
									selectedKeys={notesState.selectedKeys}
									onSelectionChange={notesState.setSelectedKeys}
									aria-label="Notes selection list"
								/>
							</TabPanel>
							<TabPanel id="chars">
								<EntityGridBox
									items={charactersState.items}
									selectionMode="multiple"
									selectedKeys={charactersState.selectedKeys}
									onSelectionChange={charactersState.setSelectedKeys}
									aria-label="Character selection list"
								/>
							</TabPanel>
							<TabPanel id="factions">
								<EntityGridBox
									items={factionsState.items}
									selectionMode="multiple"
									selectedKeys={factionsState.selectedKeys}
									onSelectionChange={factionsState.setSelectedKeys}
									aria-label="Faction selection list"
								/>
							</TabPanel>
						</Tabs>
					</div>
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}

export function EntityGridBox<T extends BasicEntity>({
	items,
	...props
}: GridListProps<T>) {
	return (
		<GridList items={items} {...props}>
			{(item) => <GridListItem>{item.name}</GridListItem>}
		</GridList>
	);
}
