import { DialogTrigger, TableBody } from "react-aria-components";
import { useState } from "react";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Input } from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Popover } from "~/components/ui/popover";
import { useCharacterRouteData } from "~/routes/_app.characters.$characterId/route";

export function CharacterAllyTable() {
	const { characterData } = useCharacterRouteData();
	return (
		<Table selectionMode="none">
			<TableHeader>
				<Column isRowHeader width={"1fr"}>
					Ally
				</Column>
				<Column isRowHeader width={"2fr"}>
					Description
				</Column>
			</TableHeader>
			<TableBody items={characterData.allies}>
				{(item) => (
					<CharacterAllyTableRow
						id={item.characterId}
						allyName={item.ally.name}
						allyDescription={item.description}
					/>
				)}
			</TableBody>
		</Table>
	);
}

function CharacterAllyTableRow({
	id,
	allyName,
	allyDescription,
}: {
	id: string;
	allyName: string;
	allyDescription: string | null;
}) {
	const [description, setDescription] = useState(allyDescription ?? "description");

	const [isEditing, setIsEditing] = useState(false);

	const submit = useSubmit();

	const handleEditPressed = () => {
		if (isEditing === true) {
			submit({ description, characterId: id }, { method: "PUT" });
		}
		setIsEditing(!isEditing);
	};

	return (
		<Row id={id}>
			<Cell>{allyName}</Cell>
			<Cell>
				<div className="flex justify-between items-center w-full">
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
