import { EntityHeader, EntityView } from "~/components/layout";
import { useFactionRouteData } from "./route";
import { Outlet } from "@remix-run/react";
import { LeaderSelect } from "./components/faction-leader";
import { DialogTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";

export default function FactionView() {
	const { faction } = useFactionRouteData();
	return (
		<EntityView>
			<div className="w-11/12 mx-auto">
				<FactionMenu factionId={faction.id} />
				<EntityHeader title={faction.name}>
					<LeaderSelect />
				</EntityHeader>
			</div>
			<Outlet />
		</EntityView>
	);
}

function FactionMenu({ factionId }: { factionId: string }) {
	return (
		<DialogTrigger>
			<Button>Menu</Button>
			<Menu>
				<MenuItem href={`/factions/${factionId}/members`}>Manage Members</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
