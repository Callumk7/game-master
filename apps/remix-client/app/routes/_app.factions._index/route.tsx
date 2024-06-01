import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { getFactionsAndMembers } from "./queries.server";
import { useLoaderData } from "@remix-run/react";
import { createFactionAndMemberNodes } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const factionData = await getFactionsAndMembers(context, request);

	return json({ factionData });
};

export default function FactionIndex() {
	const { factionData } = useLoaderData<typeof loader>();

	const { nodes, edges } = createFactionAndMemberNodes(factionData);

	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={nodes} initEdges={edges} />
		</div>
	);
}
