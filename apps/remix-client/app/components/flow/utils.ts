import type { BasicEntity, EntityType, FactionWithMembers } from "@repo/db";

export type Node = {
	id: string;
	position: {
		x: number;
		y: number;
	};
	data: {
		label: string;
		entityType: EntityType;
	};
	type?: NodeType;
};

export type NodeType = "factionNode" | "characterNode" | "noteNode" | "sessionNode";

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
	const initNodes: Node[] = createNodes(factionData, "factions", "factionNode");
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
