import { EntityHeader, EntityView } from "~/components/layout";
import { useFactionRouteData } from "./route";
import { Outlet } from "@remix-run/react";
import { LeaderSelect } from "./components/faction-leader";

export default function FactionView() {
	const { faction } = useFactionRouteData();
	return (
		<EntityView>
			<EntityHeader title={faction.name}>
				<LeaderSelect />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
