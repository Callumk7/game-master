import { TrashIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useSubmit } from "@remix-run/react";
import {
	CharacterWithRaceAndFactions,
	createDrizzleForTurso,
	getAllUserCharacters,
	internalServerError,
	methodNotAllowed,
} from "@repo/db";
import ky from "ky";
import { Group, TableBody } from "react-aria-components";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { EntityFilter } from "~/components/entity-filter";
import { Header } from "~/components/typeography";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Button } from "~/components/ui/button";
import { Tag, TagGroup } from "~/components/ui/tag-group";
import { Toolbar } from "~/components/ui/toolbar";
import { useFilterByRelation } from "~/hooks/filter-by-relation";
import { useSortTable } from "~/hooks/sort-table";
import { validateUser } from "~/lib/auth";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const db = createDrizzleForTurso(context.cloudflare.env);

	const allCharacters = await getAllUserCharacters(db, userId);

	return typedjson({ allCharacters });
};

export default function CharacterIndex() {
	const { allCharacters } = useTypedLoaderData<typeof loader>();
	const filterSource = allCharacters.map((char) => ({
		...char,
		characters: [],
		factions: char.factions.map((f) => f.faction),
		sessions: [],
		locations: [],
	}));
	const filter = useFilterByRelation(filterSource);
	const factionList = allCharacters.flatMap((note) =>
		note.factions.map((faction) => faction.faction),
	);
	return (
		<div className="w-4/5 mx-auto mt-10 space-y-4">
			<Header style="h1">All Characters</Header>
			<EntityFilter
				allChars={[]}
				allFactions={factionList}
				allSessions={[]}
				charFilter={filter.charFilter}
				factionFilter={filter.factionFilter}
				sessionFilter={filter.seshFilter}
				handleCharFilter={filter.handleCharFilter}
				handleFactionFilter={filter.handleFactionFilter}
				handleSessionFilter={filter.handleSessionFilter}
				handleClearAllFilters={filter.handleClearAllFilters}
			/>
			<div className="mb-5">
				<CharacterTable characters={filter.output} />
			</div>
			<Button>Add</Button>
		</div>
	);
}
interface CharacterTableProps {
	characters: CharacterWithRaceAndFactions[];
}

function CharacterTable({ characters }: CharacterTableProps) {
	const sort = useSortTable(characters, "name");
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
