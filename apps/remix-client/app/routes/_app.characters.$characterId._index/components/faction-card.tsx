import { Pencil2Icon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import { Faction } from "@repo/db";
import { useState } from "react";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/text-field";

interface CharacterFactionCardProps {
	faction: Faction;
	role: string | null;
	description: string | null;
}

export function CharacterFactionCard({
	faction,
	role,
	description,
}: CharacterFactionCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	return (
		<div className="relative p-4">
			<Header style="h4">{faction.name}</Header>
			{isEditing ? (
				<Form method="put" onSubmit={() => setIsEditing(false)}>
					<TextField label="Role" name="role" />
					<TextField label="Description" name="description" />
					<input type="hidden" value={faction.id} name="factionId" />
					<Button type="submit">ok</Button>
				</Form>
			) : (
				<div className="grid grid-cols-2 gap-2">
					<p className="font-bold">Role</p>
					<p>{role}</p>
					<p className="font-bold">Description</p>
					<p>{description}</p>
				</div>
			)}
			<Button
				size="icon-sm"
				variant="ghost"
				className="absolute top-3 right-3"
				onPress={() => setIsEditing(!isEditing)}
			>
				<Pencil2Icon />
			</Button>
		</div>
	);
}
