import type { LoaderFunctionArgs } from "@remix-run/node";
import { type Params, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { Background, Controls, type Edge, type Node, ReactFlow } from "@xyflow/react";
import { addPositionsToNodeTree, convertToReactFlowElements } from "~/lib/nodes";

const getParams = (params: Params) => {
  return parseParams(params, { charId: z.string() });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId } = getParams(params);

  const relations = await api.characters.getRelations(charId);
  return { relations };
};

export default function CharacterRelationsRoute() {
  const { relations } = useLoaderData<typeof loader>();

  const compactTree = addPositionsToNodeTree(relations, {
    layoutDirection: "vertical",
    horizontalSpacing: 180,
    verticalSpacing: 100,
    groupSpacing: 30,
  });

  const { nodes, edges } = convertToReactFlowElements(compactTree);

  return <Flow nodes={nodes} edges={edges} />;
}

function Flow({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {" "}
      {/* Add explicit height */}
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
