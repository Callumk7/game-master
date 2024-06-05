import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { CharacterWithRaceAndFactions } from "@repo/db";
import { Group, TableBody } from "react-aria-components";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Button } from "~/components/ui/button";
import { Tag, TagGroup } from "~/components/ui/tag-group";
import { Toolbar } from "~/components/ui/toolbar";
import { useSort } from "~/hooks/sort";

interface CharacterTableProps {
	characters: CharacterWithRaceAndFactions[];
}
export function CharacterTable({ characters }: CharacterTableProps) {
	const sort = useSort(characters, "name");
	const submit = useSubmit();
	return (
		<Table
			className={"w-full"}
			aria-label="character table"
			sortDescriptor={sort.sortDescriptor}
			onSortChange={sort.handleSortChange}
		>
			<TableHeader>
				<Column isRowHeader allowsSorting id="name">
					Name
				</Column>
				<Column isRowHeader allowsSorting id="class">
					Class
				</Column>
				<Column isRowHeader width={"0.5fr"} allowsSorting id="level">
					Level
				</Column>
				<Column isRowHeader>Factions</Column>
				<Column isRowHeader width={"0.5fr"}>
					Controls
				</Column>
			</TableHeader>
			<TableBody items={sort.sortedItems}>
				{(char) => (
					<Row href={`/characters/${char.id}`}>
						<Cell>{char.name}</Cell>
						<Cell>{char.class}</Cell>
						<Cell>{char.level}</Cell>
						<Cell>
							<TagGroup>
								{char.factions.map((f) => (
									<Tag key={f?.id}>{f?.name}</Tag>
								))}
							</TagGroup>
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
