import { TrashIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useSubmit } from "@remix-run/react";
import type {
	CharacterWithRaceAndFactions,
} from "@repo/db";
import { Group, TableBody } from "react-aria-components";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/typeography";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Button } from "~/components/ui/button";
import { Tag, TagGroup } from "~/components/ui/tag-group";
import { Toolbar } from "~/components/ui/toolbar";
import { useSort } from "~/hooks/sort";
import { validateUser } from "~/lib/auth";
import { createApi } from "~/lib/game-master";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const api = createApi(context);
	const allCharacters = (await api
		.get("characters", {
			searchParams: new URLSearchParams([["userId", userId]]),
		})
		.json()) as CharacterWithRaceAndFactions[];
	return typedjson({ allCharacters });
};

export default function CharacterIndex() {
	const { allCharacters } = useTypedLoaderData<typeof loader>();
	// const filter = useFilterByRelation(allCharacters);
	return (
		<div className="mx-auto mt-10 space-y-4 w-4/5">
			<Header style="h1">All Characters</Header>
			<div className="mb-5">
				<CharacterTable characters={allCharacters} />
			</div>
			<Button>Add</Button>
		</div>
	);
}

interface CharacterTableProps {
	characters: CharacterWithRaceAndFactions[];
}

function CharacterTable({ characters }: CharacterTableProps) {
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
