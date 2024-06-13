import { Outlet, useSubmit } from "@remix-run/react";
import { DialogTrigger } from "react-aria-components";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { NavigationLinks } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";
import type { loader } from "./route";
import { z } from "zod";
import { INTENT } from "@repo/db";

export const UpdateCharacterNameSchema = z.object({
	intent: z.literal(INTENT.UPDATE_NAME),
	name: z.string(),
});

export function CharacterView() {
	const { characterData } = useTypedLoaderData<typeof loader>();
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
						submit({}, { method: "DELETE", action: `/characters/${characterId}` })
					}
				>
					Delete
				</MenuItem>
				<MenuItem>Duplicate</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
