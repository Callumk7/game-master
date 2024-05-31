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

export const createNodes = (
	data: BasicEntity[],
	entityType: EntityType,
	nodeType?: NodeType,
	initX?: number,
	initY?: number,
) => {
	let xPosition = initX ?? 0;
	const yPosition = initY ?? 0;
	const nodes: Node[] = [];
	for (const n of data) {
		nodes.push({
			id: n.id,
			position: {
				x: xPosition,
				y: yPosition,
			},
			data: {
				label: n.name,
				entityType,
			},
			type: nodeType,
		});
		xPosition = xPosition + 400;
	}

	return nodes;
};

export const createFactionAndMemberNodes = (factionData: FactionWithMembers[]) => {
	let xPosition = 0;
	let yPosition = 200;
	const initNodes: Node[] = [];
	const initEdges: Edge[] = [];

	for (const faction of factionData) {
		initNodes.push({
			id: faction.id,
			position: {
				x: xPosition,
				y: 0,
			},
			data: {
				label: faction.name,
				entityType: "factions",
			},
			type: "factionNode",
		});

		let memXPosition = xPosition;
		for (const member of faction.members) {
			initNodes.push({
				id: member.characterId,
				position: {
					x: memXPosition,
					y: yPosition,
				},
				data: {
					label: member.character.name,
					entityType: "characters",
				},
				type: "characterNode",
			});

			initEdges.push({
				id: `${member.characterId}-${faction.id}`,
				source: faction.id,
				target: member.characterId,
				animated: true,
			});

			yPosition = yPosition + 60;
			memXPosition = memXPosition + 50;
		}
		yPosition = 200;
		xPosition = xPosition + 400;
	}

	return {
		initNodes,
		initEdges,
	};
};

export const createSessionAndRelationNodes = (
	sessionData: SessionWithFullRelations[],
) => {
	let xPosition = 0;
	let yPosition = 200;
	const initNodes: Node[] = [];
	const initEdges: Edge[] = [];

	for (const session of sessionData) {
		initNodes.push({
			id: session.id,
			position: {
				x: xPosition,
				y: 0,
			},
			data: {
				label: session.name,
				entityType: "sessions",
			},
			type: "sessionNode",
			dragHandle: ".drag-handle",
		});

		let memXPosition = xPosition;
		for (const character of session.characters) {
			initNodes.push({
				id: character.id,
				position: {
					x: memXPosition,
					y: yPosition,
				},
				data: {
					label: character.name,
					entityType: "characters",
				},
				type: "characterNode",
				dragHandle: ".drag-handle",
			});

			initEdges.push({
				id: `${character.id}-${session.id}`,
				source: session.id,
				target: character.id,
				animated: true,
			});

			memXPosition = memXPosition + 100;
		}
		for (const faction of session.factions) {
			initNodes.push({
				id: faction.id,
				position: {
					x: memXPosition,
					y: yPosition,
				},
				data: {
					label: faction.name,
					entityType: "factions",
				},
				type: "factionNode",
				dragHandle: ".drag-handle",
			});

			initEdges.push({
				id: `${faction.id}-${session.id}`,
				source: session.id,
				target: faction.id,
				animated: true,
			});

			memXPosition = memXPosition + 100;
		}
		for (const note of session.notes) {
			initNodes.push({
				id: note.id,
				position: {
					x: memXPosition,
					y: yPosition,
				},
				data: {
					label: note.name,
					entityType: "notes",
				},
				type: "noteNode",
				dragHandle: ".drag-handle",
			});

			initEdges.push({
				id: `${note.id}-${session.id}`,
				source: session.id,
				target: note.id,
				animated: true,
			});

			memXPosition = memXPosition + 100;
		}
		yPosition = 200;
		xPosition = xPosition + 400;
	}

	return {
		initNodes,
		initEdges,
	};
};
