import { DialogTrigger, TableBody } from "react-aria-components";
import { useState } from "react";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Input } from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Popover } from "~/components/ui/popover";
import { useCharacterRouteData } from "~/routes/_app.characters.$characterId/route";

export function CharacterFactionTable() {
	const { characterData } = useCharacterRouteData();
	return (
		<Table selectionMode="none">
			<TableHeader>
				<Column isRowHeader width={"2fr"}>
					Faction
				</Column>
				<Column isRowHeader width={"1fr"}>
					Role
				</Column>
				<Column isRowHeader width={"2fr"}>
					Description
				</Column>
			</TableHeader>
			<TableBody items={characterData.factions}>
				{(item) => (
					<CharacterFactionTableRow
						id={item.factionId}
						factionName={item.faction.name}
						factionRole={item.role}
						factionDescription={item.description}
					/>
				)}
			</TableBody>
		</Table>
	);
}

function CharacterFactionTableRow({
	id,
	factionName,
	factionRole,
	factionDescription,
}: {
	id: string;
	factionName: string;
	factionRole: string | null;
	factionDescription: string | null;
}) {
	const [role, setRole] = useState(factionRole ?? "role");
	const [description, setDescription] = useState(factionDescription ?? "description");

	const [isEditing, setIsEditing] = useState(false);

	const submit = useSubmit();

	const handleEditPressed = () => {
		if (isEditing === true) {
			submit({ role, description, factionId: id }, { method: "PUT" });
		}
		setIsEditing(!isEditing);
	};

	return (
		<Row id={id} href={`/factions/${id}`}>
			<Cell>{factionName}</Cell>
			<Cell>
				<div className="flex w-full justify-between items-center">
					{role}
					<DialogTrigger>
						<Button size="icon-sm" variant="ghost" onPress={handleEditPressed}>
							<Pencil2Icon />
						</Button>
						<Popover placement="left" className={"w-96"}>
							<Input
								value={role}
								onInput={(e) => setRole(e.currentTarget.value)}
								autoFocus
							/>
						</Popover>
					</DialogTrigger>
				</div>
			</Cell>
			<Cell>
				<div className="flex w-full justify-between items-center">
					{description}
					<DialogTrigger>
						<Button size="icon-sm" variant="ghost" onPress={handleEditPressed}>
							<Pencil2Icon />
						</Button>
						<Popover>
							<Input
								className="border border-amber-10"
								value={description}
								onInput={(e) => setDescription(e.currentTarget.value)}
							/>
						</Popover>
					</DialogTrigger>
				</div>
			</Cell>
		</Row>
	);
}
