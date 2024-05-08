import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit, Outlet, useLoaderData } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityView, EntityHeader, SidebarLayout } from "~/components/layout";
import { loader } from "./route";
import { Button } from "~/components/ui/button";

export function CharacterView() {
	const character = useLoaderData<typeof loader>().characterData;

	const submit = useSubmit();

	const navItems = [
		{
			name: "Bio",
			href: `/characters/${character.id}`,
		},
		{
			name: "Notes",
			href: `/characters/${character.id}/notes`,
		},
		{
			name: "Relationships",
			href: `/characters/${character.id}/links`,
		},
		{
			name: "Factions",
			href: `/characters/${character.id}/factions`,
		},
	];

	return (
		<EntityView margin top>
			<Button
				size="sm"
				variant="destructive"
				onPress={() => submit({}, { method: "DELETE" })}
			>
				<TrashIcon />
			</Button>
			<EntityHeader title={character.name}>
				<div className="flex gap-6 border-t border-grade-6 pt-2">
					<p>
						<span className="font-semibold">Class:</span> {character.class}
					</p>
					<p>
						<span className="font-semibold">Level:</span> {character.level}
					</p>
				</div>
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
