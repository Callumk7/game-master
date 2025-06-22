import type { LoaderFunctionArgs } from "@remix-run/node";
import { type Params, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import {
  Background,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { addPositionsToNodeTree, convertToReactFlowElements } from "~/lib/nodes";
import { useTheme } from "~/lib/theme/dark-mode-context";

const getParams = (params: Params) => {
  return parseParams(params, { charId: z.string() });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId } = getParams(params);

  const relations = await api.characters.getRelations(charId, 5);
  return { relations };
};

export default function CharacterRelationsRoute() {
  const { relations } = useLoaderData<typeof loader>();
  const relationsKey = useMemo(() => JSON.stringify(relations), [relations]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: static reference
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    console.log("🔄 EXPENSIVE: Computing everything...");
    const compactTree = addPositionsToNodeTree(relations, {
      layoutDirection: "vertical",
      horizontalSpacing: 180,
      verticalSpacing: 100,
      groupSpacing: 30,
    });

    return convertToReactFlowElements(compactTree);
  }, [relationsKey]);

  return <Flow initialNodes={initialNodes} initialEdges={initialEdges} />;
}

function Flow({
  initialNodes,
  initialEdges,
}: { initialNodes: Node[]; initialEdges: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { theme } = useTheme();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        colorMode={theme === "dark" ? "dark" : theme === "light" ? "light" : "system"}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={true}
        fitView
        fitViewOptions={{ padding: 50 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
