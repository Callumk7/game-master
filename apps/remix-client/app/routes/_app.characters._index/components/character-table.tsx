import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { CharacterWithRaceAndFactions } from "@repo/db";
import { Group, type Selection, TableBody } from "react-aria-components";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Button } from "~/components/ui/button";
import { Tag, TagGroup } from "~/components/ui/tag-group";
import { Toolbar } from "~/components/ui/toolbar";
import { useSort } from "~/hooks/sort";

interface CharacterTableProps {
	characters: CharacterWithRaceAndFactions[];
	isSelecting: boolean;
	selectedChars: string[];
	setSelectedChars: (selectedChars: string[]) => void;
}
export function CharacterTable({
	characters,
	isSelecting,
	selectedChars,
	setSelectedChars,
}: CharacterTableProps) {
	const sort = useSort(characters, "name");
	const submit = useSubmit();

	const handleSelectionChange = (keys: Selection) => {
		if (keys !== "all") {
			const ids = [...keys].map((k) => k.toString());
			setSelectedChars(ids);
		} else {
			if (selectedChars.length > 0) {
				setSelectedChars([]);
			} else {
				setSelectedChars(characters.map((char) => char.id));
			}
		}
	};

	return (
		<Table
			className={"w-full"}
			aria-label="character table"
			sortDescriptor={sort.sortDescriptor}
			onSortChange={sort.handleSortChange}
			selectionMode={isSelecting ? "multiple" : "none"}
			selectedKeys={selectedChars}
			onSelectionChange={handleSelectionChange}
		>
			<TableHeader>
				<Column isRowHeader allowsSorting id="name" width={"2fr"}>
					Name
				</Column>
				<Column isRowHeader allowsSorting id="race" width={"1fr"}>
					Race
				</Column>
				<Column isRowHeader width={"1fr"}>
					Factions
				</Column>
				<Column isRowHeader width={"1fr"}>
					Image
				</Column>
				<Column isRowHeader width={"0.5fr"}>
					Controls
				</Column>
			</TableHeader>
			<TableBody items={sort.sortedItems}>
				{(char) => (
					<Row href={`/characters/${char.id}`}>
						<Cell>{char.name}</Cell>
						<Cell>{char.race.name}</Cell>
						<Cell>
							<TagGroup>
								{char.factions.map((f) => (
									<Tag key={f?.id}>{f?.name}</Tag>
								))}
							</TagGroup>
						</Cell>
						<Cell>
							{char.image && (
								<img
									src={char.image}
									alt={`Portrait of ${char.name}`}
									className="max-h-16 rounded-lg overflow-hidden mx-auto"
								/>
							)}
						</Cell>
						<Cell>
							<Toolbar>
								<Group aria-label="manage">
									<Button
										variant="ghost"
										onPress={() =>
											submit(
												{ characterId: char.id },
												{ method: "DELETE", action: "/characters" },
											)
										}
									>
										<TrashIcon />
									</Button>
								</Group>
							</Toolbar>
						</Cell>
					</Row>
				)}
			</TableBody>
		</Table>
	);
}
