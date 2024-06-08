import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { getFactionsAndMembers } from "./queries.server";
import { useLoaderData } from "@remix-run/react";
import { createAllFactionWithMemberNodes } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";
import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const factionData = await getFactionsAndMembers(context, request);

	return json({ factionData });
};

export default function FactionIndex() {
	const { factionData } = useLoaderData<typeof loader>();

	const { nodes, edges } = createAllFactionWithMemberNodes(factionData);

	return (
		<Container width="max">
			<div className="mx-auto w-11/12">
				<Header style="h1">All Factions</Header>
			</div>
			<div className="w-full h-screen relative">
				<NodeCanvas initNodes={nodes} initEdges={edges} fitView />
			</div>
		</Container>
	);
}
