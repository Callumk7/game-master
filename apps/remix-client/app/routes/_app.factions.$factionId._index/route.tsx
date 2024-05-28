import { useFactionRouteData } from "../_app.factions.$factionId/route";

export default function FactionIndex() {
	const { faction } = useFactionRouteData();
	return (
		<div>
			<div>Faction Route</div>
		</div>
	);
}
