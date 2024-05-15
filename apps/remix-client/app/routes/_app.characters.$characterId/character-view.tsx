import { Outlet } from "@remix-run/react";
import { EntityView, EntityHeader } from "~/components/layout";
import { loader } from "./route";
import { useTypedLoaderData } from "remix-typedjson";
import { Link } from "~/components/ui/link";
import { NavigationLinks } from "~/components/navigation";

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
			name: "links",
			href: `/characters/${characterData.id}/links`,
		},
	];
	return (
		<EntityView top className="px-6">
			<EntityHeader title={characterData.name}>
				<NavigationLinks links={links} />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
