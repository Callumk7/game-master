import { Outlet, useFetcher } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { NavigationLinks } from "~/components/navigation";
import type { loader } from "./route";
import { z } from "zod";
import { INTENT } from "@repo/db";
import { CharacterMenu } from "./components/character-menu";
import { Button } from "~/components/ui/button";

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
	const fetcher = useFetcher();
	return (
		<EntityView top margin menu={<CharacterMenu characterId={characterData.id} />}>
			<EntityHeader title={characterData.name}>
				<NavigationLinks links={links} />
				<Button
					onPress={() =>
						fetcher.submit(
							{ characterName: characterData.name },
							{ method: "POST", encType: "application/json" },
						)
					}
				>
					Generate Bio
				</Button>
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
