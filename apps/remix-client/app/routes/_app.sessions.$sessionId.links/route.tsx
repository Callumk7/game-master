import { LinkTabsView } from "./components/link-tab-view";
import { useSessionRouteData } from "../_app.sessions.$sessionId/route";

export default function SessionLinksView() {
	const { session } = useSessionRouteData();
	const characters = session.characters.map((c) => c.character);
	const factions = session.factions.map((f) => f.faction);
	return (
		<div>
			<LinkTabsView characters={characters} factions={factions} />
		</div>
	);
}
