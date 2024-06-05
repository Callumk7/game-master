import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createDrizzleForTurso, getCharacterFactionsWithMembersAndNotes } from "@repo/db";
import { NodeCanvas } from "~/components/flow/canvas";
import { createAllFactionWithMemberNodes } from "~/components/flow/utils";
import { extractParam } from "~/lib/zx-util";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const db = createDrizzleForTurso(context.cloudflare.env);
	const characterId = extractParam("characterId", params);
	const factions = await getCharacterFactionsWithMembersAndNotes(db, characterId);
	return json({ factions });
};

export default function CharacterFactionView() {
	const { factions } = useLoaderData<typeof loader>();
	const { nodes, edges } = createAllFactionWithMemberNodes(factions);
	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={nodes} initEdges={edges} />
		</div>
	);
}
