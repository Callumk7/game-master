import { NodeCanvas } from "~/components/flow/canvas";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { createFactionWithMemberNodes } from "~/components/flow/utils";

export default function FactionIndex() {
	const { faction } = useFactionRouteData();
	const { nodes, edges } = createFactionWithMemberNodes(faction);
	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={nodes} initEdges={edges} />
		</div>
	);
}
