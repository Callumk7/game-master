import { createFactionWithMemberNodes } from "~/components/flow/utils";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { NodeCanvas } from "~/components/flow/canvas";

export default function FactionLinksView() {
	const { faction } = useFactionRouteData();
	const { nodes, edges } = createFactionWithMemberNodes(faction);
	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={nodes} initEdges={edges} fitView />
		</div>
	);
}
