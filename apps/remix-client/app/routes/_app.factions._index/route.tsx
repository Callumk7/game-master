import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useCallback, useState } from "react";
import ReactFlow, {
	useNodesState,
	useEdgesState,
	addEdge,
	type Connection,
	type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { getFactionsAndMembers } from "./queries.server";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { createFactionAndMemberNodes } from "~/components/flow/utils";
import { MainNode } from "~/components/flow/node";
import { DialogTrigger } from "react-aria-components";
import { Dialog } from "~/components/ui/dialog";
import { Modal } from "~/components/ui/modal";
import { Input } from "~/components/ui/field";
import { uuidv4 } from "callum-util";
import { NodeCanvas } from "~/components/flow/canvas";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const factionData = await getFactionsAndMembers(context, request);

	return json({ factionData });
};

const nodeTypes = { textUpdater: MainNode };

export default function FactionIndex() {
	const { factionData } = useLoaderData<typeof loader>();

	const { initNodes, initEdges } = createFactionAndMemberNodes(factionData);

	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={initNodes} initEdges={initEdges}>
				<Button>Hello</Button>
			</NodeCanvas>
		</div>
	);
}

function NewFactionNode({
	newFactionName,
	setNewFactionName,
	handleSave,
}: {
	newFactionName: string;
	setNewFactionName: (newName: string) => void;
	handleSave: () => void;
}) {
	return (
		<DialogTrigger>
			<Button>New</Button>
			<Modal>
				<Dialog>
					<div className="space-y-4">
						<Input
							value={newFactionName}
							onInput={(e) => setNewFactionName(e.currentTarget.value)}
						/>
						<Button onPress={handleSave}>Save</Button>
					</div>
				</Dialog>
			</Modal>
		</DialogTrigger>
	);
}
