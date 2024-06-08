import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Outlet, useSubmit } from "@remix-run/react";
import { DialogTrigger } from "react-aria-components";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { NavigationLinks } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";
import type { loader } from "./route";

export function CharacterView() {
	const { characterData, noteTree } = useTypedLoaderData<typeof loader>();
	const links = [
		{
			name: "Home",
			href: `/characters/${characterData.id}`,
		},
		{
			name: "Notes",
			href: `/characters/${characterData.id}/notes`,
		},
		{
			name: "Faction",
			href: `/characters/${characterData.id}/faction`,
		},
		{
			name: "links",
			href: `/characters/${characterData.id}/links`,
		},
	];
	return (
		<EntityView top margin menu={<CharacterMenu characterId={characterData.id} />}>
			<EntityHeader title={characterData.name}>
				<NavigationLinks links={links} />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}

function CharacterMenu({ characterId }: { characterId: string }) {
	const submit = useSubmit();
	return (
		<DialogTrigger>
			<Button>Menu</Button>
			<Menu>
				<MenuItem
					onAction={() =>
						submit({ characterId }, { method: "DELETE", action: "/characters" })
					}
				>
					Delete
				</MenuItem>
				<MenuItem>Duplicate</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
