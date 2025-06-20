import type { EntityType } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { factions } from "~/db/schema/factions";
import { notes } from "~/db/schema/notes";

export interface NodeTree {
	id: string;
	name: string;
	type: EntityType;
	children: {
		[key in EntityType]?: NodeTree[];
	};
}

interface GetNodeTreeArgs {
	id: string;
	type: EntityType;
	depth?: number;
	visited?: Set<string>; // Prevent infinite loops
}

export async function getNodeTree(args: GetNodeTreeArgs): Promise<NodeTree | null> {
	const { id, type, depth = 3, visited = new Set() } = args;

	// Prevent infinite recursion
	const nodeKey = `${type}:${id}`;
	if (visited.has(nodeKey) || depth <= 0) {
		return null;
	}

	visited.add(nodeKey);

	try {
		switch (type) {
			case "characters":
				return await getCharacterNode(id, depth - 1, visited);
			case "factions":
				return await getFactionNode(id, depth - 1, visited);
			case "notes":
				return await getNoteNode(id, depth - 1, visited);
			default:
				throw new Error(`Unknown entity type: ${type}`);
		}
	} catch (error) {
		console.error(`Error fetching node tree for ${type}:${id}`, error);
		return null;
	} finally {
		visited.delete(nodeKey); // Allow revisiting in other branches
	}
}

async function getCharacterNode(
	id: string,
	remainingDepth: number,
	visited: Set<string>,
): Promise<NodeTree | null> {
	const result = await db.query.characters.findFirst({
		where: eq(characters.id, id),
		with: {
			factions: true,
			notes: true,
		},
	});

	if (!result) return null;

	const node: NodeTree = {
		id: result.id,
		name: result.name,
		type: "characters",
		children: {},
	};

	if (remainingDepth > 0) {
		// Get related factions
		if (result.factions?.length > 0) {
			const factionNodes = await Promise.all(
				result.factions.map((faction) =>
					getNodeTree({
						id: faction.factionId,
						type: "factions",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.factions = factionNodes.filter(Boolean) as NodeTree[];
		}

		// Get related notes
		if (result.notes?.length > 0) {
			const noteNodes = await Promise.all(
				result.notes.map((note) =>
					getNodeTree({
						id: note.noteId,
						type: "notes",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.notes = noteNodes.filter(Boolean) as NodeTree[];
		}
	}

	return node;
}

async function getFactionNode(
	id: string,
	remainingDepth: number,
	visited: Set<string>,
): Promise<NodeTree | null> {
	const result = await db.query.factions.findFirst({
		where: eq(factions.id, id),
		with: {
			members: true, // characters
			notes: true,
		},
	});

	if (!result) return null;

	const node: NodeTree = {
		id: result.id,
		name: result.name,
		type: "factions",
		children: {},
	};

	if (remainingDepth > 0) {
		// Get member characters
		if (result.members?.length > 0) {
			const characterNodes = await Promise.all(
				result.members.map((character) =>
					getNodeTree({
						id: character.characterId,
						type: "characters",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.characters = characterNodes.filter(Boolean) as NodeTree[];
		}

		// Get related notes
		if (result.notes?.length > 0) {
			const noteNodes = await Promise.all(
				result.notes.map((note) =>
					getNodeTree({
						id: note.noteId,
						type: "notes",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.notes = noteNodes.filter(Boolean) as NodeTree[];
		}
	}

	return node;
}

async function getNoteNode(
	id: string,
	remainingDepth: number,
	visited: Set<string>,
): Promise<NodeTree | null> {
	const result = await db.query.notes.findFirst({
		where: eq(notes.id, id),
		with: {
			characters: true,
			factions: true,
		},
	});

	if (!result) return null;

	const node: NodeTree = {
		id: result.id,
		name: result.name,
		type: "notes",
		children: {},
	};

	if (remainingDepth > 0) {
		// Get related characters
		if (result.characters?.length > 0) {
			const characterNodes = await Promise.all(
				result.characters.map((character) =>
					getNodeTree({
						id: character.characterId,
						type: "characters",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.characters = characterNodes.filter(Boolean) as NodeTree[];
		}

		// Get related factions
		if (result.factions?.length > 0) {
			const factionNodes = await Promise.all(
				result.factions.map((faction) =>
					getNodeTree({
						id: faction.factionId,
						type: "factions",
						depth: remainingDepth,
						visited: new Set(visited),
					}),
				),
			);
			node.children.factions = factionNodes.filter(Boolean) as NodeTree[];
		}
	}

	return node;
}
