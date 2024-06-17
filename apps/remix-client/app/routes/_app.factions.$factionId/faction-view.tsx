import { EntityHeader, EntityView } from "~/components/layout";
import { useFactionRouteData } from "./route";
import { Outlet } from "@remix-run/react";
import { LeaderSelect } from "./components/faction-leader";
import { FactionMenu } from "./components/faction-menu";

export default function FactionView() {
	const { faction } = useFactionRouteData();
	return (
		<EntityView margin menu={<FactionMenu factionId={faction.id} />}>
			<EntityHeader title={faction.name}>
				<LeaderSelect />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
