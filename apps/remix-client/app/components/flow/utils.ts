import type {
	BasicEntity,
	EntityType,
	FactionWithMembers,
	SessionWithFullRelations,
} from "@repo/db";

export type Node = {
	id: string;
	position: {
		x: number;
		y: number;
	};
	data: NodeData;
	type?: NodeType;
	dragHandle?: string;
};

export type NodeType = "factionNode" | "characterNode" | "noteNode" | "sessionNode";
export type NodeData = {
	label: string;
	entityType: EntityType;
};

export type Edge = {
	id: string;
	source: string;
	target: string;
	animated?: boolean;
};

type CreateNodesArgs = {
	data: BasicEntity[];
	initNodes?: Node[];
	entityType: EntityType;
	nodeType?: NodeType;
	initX?: number;
	initY?: number;
};
const createNodes = ({
	data,
	initNodes,
	entityType,
	nodeType,
	initX,
	initY,
}: CreateNodesArgs) => {
	let xPosition = initX ?? 0;
	const yPosition = initY ?? 0;
	const nodes: Node[] = initNodes ?? [];
	for (const n of data) {
		if (!nodes.find((node) => node.id === n.id)) {
			pushEntity(
				nodes,
				n,
				xPosition,
				yPosition,
				{ label: n.name, entityType },
				nodeType,
			);
		}
		xPosition = xPosition + 300;
	}

	return nodes;
};
const pushEntity = (
	nodes: Node[],
	entity: BasicEntity,
	xPosition: number,
	yPosition: number,
	data: NodeData,
	type?: NodeType,
) => {
	nodes.push({
		id: entity.id,
		position: {
			x: xPosition,
			y: yPosition,
		},
		data,
		type,
		dragHandle: ".drag-handle",
	});
};

const createEdges = (
	data: { sourceId: string; targetId: string }[],
	initEdges: Edge[] = [],
) => {
	for (const e of data) {
		initEdges.push({
			id: `${e.sourceId}-${e.targetId}`,
			source: e.sourceId,
			target: e.targetId,
			animated: true,
		});
	}
	return initEdges;
};

export const createFactionAndMemberNodes = (factionData: FactionWithMembers[]) => {
	let nodes = createNodes({
		data: factionData,
		entityType: "factions",
		nodeType: "factionNode",
		initX: 0,
		initY: 0,
	});

	let edges: Edge[] = [];

	let y = 180;
	for (const faction of factionData) {
		nodes = createNodes({
			data: faction.members.map((m) => m.character),
			initNodes: nodes,
			nodeType: "characterNode",
			entityType: "characters",
			initX: nodes.find((n) => n.id === faction.id)?.position.x,
			initY: y,
		});

		const data = faction.members.map((char) => ({
			sourceId: char.factionId,
			targetId: char.characterId,
		}));

		edges = createEdges(data, edges);
		y += 100;
	}

	return {
		nodes,
		edges,
	};
};

export const createSessionAndRelationNodesAndEdges = (
	session: SessionWithFullRelations,
	initNodes: Node[] = [],
	initEdges: Edge[] = [],
	initX = 0,
	initY = 0,
) => {
	let nodes: Node[] = initNodes;
	let edges: Edge[] = initEdges;

	let x = initX;
	let y = initY;
	pushEntity(
		nodes,
		session,
		x,
		0,
		{
			label: session.name,
			entityType: "sessions",
		},
		"sessionNode",
	);
	x += 300;
	nodes = createNodes({
		data: session.factions,
		initNodes: nodes,
		nodeType: "factionNode",
		entityType: "factions",
		initX: nodes.find((n) => n.id === session.id)?.position.x,
		initY: y,
	});
	const factionEdges = session.factions.map((faction) => ({
		sourceId: session.id,
		targetId: faction.id,
	}));
	edges = createEdges(factionEdges, edges);
	y += 80;
	nodes = createNodes({
		data: session.characters,
		initNodes: nodes,
		entityType: "characters",
		nodeType: "characterNode",
		initX: nodes.find((n) => n.id === session.id)?.position.x,
		initY: y,
	});
	const characterEdges = session.characters.map((char) => ({
		sourceId: session.id,
		targetId: char.id,
	}));
	edges = createEdges(characterEdges, edges);
	y += 80;
	nodes = createNodes({
		data: session.notes,
		initNodes: nodes,
		entityType: "notes",
		nodeType: "noteNode",
		initX: nodes.find((n) => n.id === session.id)?.position.x,
		initY: y,
	});
	const noteEdges = session.notes.map((note) => ({
		sourceId: session.id,
		targetId: note.id,
	}));
	edges = createEdges(noteEdges, edges);
	y += 80;

	return {
		nodes,
		edges,
	};
};

export const createAllSessionAndRelationNodesAndEdges = (
	sessionData: SessionWithFullRelations[],
) => {
	const nodes: Node[] = [];
	const edges: Edge[] = [];

	for (const session of sessionData) {
		const data = createSessionAndRelationNodesAndEdges(session, nodes, edges);
		nodes.concat(data.nodes);
		edges.concat(data.edges);
	}

	return {
		nodes,
		edges,
	};
};
