import { EntityHeader, EntityView } from "~/components/layout";
import { useFactionRouteData } from "./route";
import { Outlet } from "@remix-run/react";
import { LeaderSelect } from "./components/faction-leader";
import { FactionMenu } from "./components/faction-menu";
import { NavigationLinks } from "~/components/navigation";

export default function FactionView() {
	const { faction } = useFactionRouteData();
	const links = [
		{
			name: "Description",
			href: `/factions/${faction.id}`,
		},
		{
			name: "Members",
			href: `/factions/${faction.id}/members`,
		},
		{
			name: "Links",
			href: `/factions/${faction.id}/links`,
		},
		{
			name: "Notes",
			href: `/factions/${faction.id}/notes`,
		},
	];
	return (
		<EntityView margin menu={<FactionMenu factionId={faction.id} />}>
			<NavigationLinks links={links} />
			<EntityHeader title={faction.name}>
				<LeaderSelect />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
