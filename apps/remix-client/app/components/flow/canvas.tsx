import { type ReactNode, useCallback, type FC } from "react";
import ReactFlow, {
	type Connection,
	addEdge,
	useEdgesState,
	useNodesState,
	type NodeProps,
} from "reactflow";
import type { Edge, NodeType, Node } from "./utils";
import { CharacterNode, FactionNode, NoteNode, SessionNode } from "./nodes";

// Defined up here so they are not re-rendered by react (could also be memoed in the component)
type NodeFunction = FC<NodeProps>;
const nodeTypes: Record<NodeType, NodeFunction> = {
	factionNode: FactionNode,
	characterNode: CharacterNode,
	noteNode: NoteNode,
	sessionNode: SessionNode,
};

interface NodeCanvasProps {
	initNodes: Node[];
	initEdges: Edge[];
	children?: ReactNode;
	fitView?: boolean;
}
export function NodeCanvas({ initNodes, initEdges, children, fitView }: NodeCanvasProps) {
	// These are prototype state managers from React Node; consider using zustand
	// when the design in finalised
	const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

	// basic handler for connecting nodes
	const onConnect = useCallback(
		(params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	return (
		<div className="w-full h-full relative">
			<div className="absolute w-fit h-fit top-4 right-4 z-50">{children}</div>
			<div className="z-0 w-full h-full">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					fitView={fitView}
					proOptions={{ hideAttribution: true }}
				/>
			</div>
		</div>
	);
}
