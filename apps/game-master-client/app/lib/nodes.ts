import type { EntityType, NodeTree } from "@repo/api";

export interface PositionedNode extends NodeTree {
	position: { x: number; y: number };
	children: {
		[key in EntityType]?: PositionedNode[];
	};
}

export interface LayoutOptions {
	nodeWidth: number;
	nodeHeight: number;
	horizontalSpacing: number;
	verticalSpacing: number;
	groupSpacing: number; // Extra spacing between entity type groups
	layoutDirection: "horizontal" | "vertical";
}

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
	nodeWidth: 200,
	nodeHeight: 60,
	horizontalSpacing: 250,
	verticalSpacing: 100,
	groupSpacing: 50,
	layoutDirection: "horizontal",
};

export function addPositionsToNodeTree(
	nodeTree: NodeTree,
	options: Partial<LayoutOptions> = {},
): PositionedNode {
	const layoutOptions = { ...DEFAULT_LAYOUT_OPTIONS, ...options };

	// Track used positions to avoid overlaps
	const usedPositions = new Set<string>();

	// Start with root node at center
	const rootPosition = { x: 0, y: 0 };

	return calculateNodePositions(
		nodeTree,
		rootPosition,
		0, // depth
		0, // siblingIndex
		1, // totalSiblings
		layoutOptions,
		usedPositions,
	);
}

function calculateNodePositions(
	node: NodeTree,
	parentPosition: { x: number; y: number },
	depth: number,
	siblingIndex: number,
	totalSiblings: number,
	options: LayoutOptions,
	usedPositions: Set<string>,
): PositionedNode {
	const {
		nodeWidth,
		nodeHeight,
		horizontalSpacing,
		verticalSpacing,
		groupSpacing,
		layoutDirection,
	} = options;

	// Calculate this node's position
	let nodePosition: { x: number; y: number };

	if (depth === 0) {
		// Root node stays at parent position
		nodePosition = { ...parentPosition };
	} else {
		if (layoutDirection === "horizontal") {
			// Horizontal layout: children spread vertically
			const totalHeight = (totalSiblings - 1) * (nodeHeight + verticalSpacing);
			const startY = parentPosition.y - totalHeight / 2;

			nodePosition = {
				x: parentPosition.x + horizontalSpacing,
				y: startY + siblingIndex * (nodeHeight + verticalSpacing),
			};
		} else {
			// Vertical layout: children spread horizontally
			const totalWidth = (totalSiblings - 1) * (nodeWidth + horizontalSpacing);
			const startX = parentPosition.x - totalWidth / 2;

			nodePosition = {
				x: startX + siblingIndex * (nodeWidth + horizontalSpacing),
				y: parentPosition.y + verticalSpacing,
			};
		}
	}

	// Ensure position is unique (handle overlaps)
	nodePosition = ensureUniquePosition(nodePosition, usedPositions, options);
	usedPositions.add(`${nodePosition.x},${nodePosition.y}`);

	// Create positioned node
	const positionedNode: PositionedNode = {
		...node,
		position: nodePosition,
		children: {},
	};

	// Process children by entity type
	let currentGroupOffset = 0;

	Object.entries(node.children).forEach(([entityType, childNodes]) => {
		if (childNodes.length === 0) return;

		// Calculate group position offset
		const groupPosition = calculateGroupPosition(
			nodePosition,
			currentGroupOffset,
			options,
			depth,
		);

		// Position all children in this entity group
		const positionedChildren = childNodes.map((childNode, index) =>
			calculateNodePositions(
				childNode,
				groupPosition,
				depth + 1,
				index,
				childNodes.length,
				options,
				usedPositions,
			),
		);

		positionedNode.children[entityType as EntityType] = positionedChildren;

		// Update offset for next group
		currentGroupOffset += childNodes.length + 1;
	});

	return positionedNode;
}

function calculateGroupPosition(
	parentPosition: { x: number; y: number },
	groupOffset: number,
	options: LayoutOptions,
	depth: number,
): { x: number; y: number } {
	const { horizontalSpacing, verticalSpacing, groupSpacing, layoutDirection } = options;

	if (layoutDirection === "horizontal") {
		return {
			x: parentPosition.x + horizontalSpacing,
			y: parentPosition.y + groupOffset * (verticalSpacing + groupSpacing),
		};
	}
	return {
		x: parentPosition.x + groupOffset * (horizontalSpacing + groupSpacing),
		y: parentPosition.y + verticalSpacing,
	};
}

function ensureUniquePosition(
	position: { x: number; y: number },
	usedPositions: Set<string>,
	options: LayoutOptions,
): { x: number; y: number } {
	let { x, y } = position;
	const { nodeWidth, nodeHeight } = options;

	let attempts = 0;
	const maxAttempts = 50;

	while (usedPositions.has(`${x},${y}`) && attempts < maxAttempts) {
		// Try slight offsets to avoid overlaps
		if (attempts % 2 === 0) {
			x += nodeWidth / 4;
		} else {
			y += nodeHeight / 4;
		}
		attempts++;
	}

	return { x, y };
}

export function convertToReactFlowElements(positionedTree: PositionedNode) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const nodes: any[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const edges: any[] = [];

	function processNode(node: PositionedNode, parentId?: string) {
		// Add node
		nodes.push({
			id: `${node.type}:${node.id}`,
			type: "custom", // You'll create custom node types
			position: node.position,
			data: {
				label: node.name,
				entityType: node.type,
				originalNode: node,
			},
		});

		// Add edges from parent
		if (parentId) {
			edges.push({
				id: `${parentId}-${node.type}:${node.id}`,
				source: parentId,
				target: `${node.type}:${node.id}`,
			});
		}

		// Process children
		Object.values(node.children)
			.flat()
			.forEach((child) => {
				processNode(child, `${node.type}:${node.id}`);
			});
	}

	processNode(positionedTree);

	return { nodes, edges };
}
