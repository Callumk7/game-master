import { useAppData } from "../_app/route";
import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { characters, createDrizzleForTurso, notes, sessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { validateUser } from "~/lib/auth";
import { useLoaderData } from "@remix-run/react";
import { type Edge, type Node, pushEntity } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const db = createDrizzleForTurso(context.cloudflare.env);
	const sessionConns = await db.query.sessions.findMany({
		where: eq(sessions.userId, userId),
		with: {
			notes: true,
			characters: true,
			factions: true,
		},
	});
	const charConns = await db.query.characters.findMany({
		where: eq(characters.userId, userId),
		with: {
			notes: true,
			factions: true,
		},
	});
	const noteConns = await db.query.notes.findMany({
		where: eq(notes.userId, userId),
		with: {
			factions: true,
		},
	});

	return json({ sessionConns, charConns, noteConns });
};

export default function AppIndex() {
	const { allNotes, allCharacters, allSessions, allFactions } = useAppData();
	const { sessionConns, charConns, noteConns } = useLoaderData<typeof loader>();

	// We are going to create notes, getting names from the app Data
	const nodes: Node[] = [];
	let xPosition = 0;
	for (const session of allSessions) {
		pushEntity(
			nodes,
			session,
			xPosition,
			0,
			{ label: session.name, entityType: "sessions" },
			"sessionNode",
		);
		xPosition += 300;
	}
	xPosition = 0;
	for (const char of allCharacters) {
		pushEntity(
			nodes,
			char,
			xPosition,
			80,
			{ label: char.name, entityType: "characters" },
			"characterNode",
		);
		xPosition += 300;
	}
	xPosition = 0;
	for (const faction of allFactions) {
		pushEntity(
			nodes,
			faction,
			xPosition,
			160,
			{ label: faction.name, entityType: "factions" },
			"factionNode",
		);
		xPosition += 300;
	}
	xPosition = 0;
	for (const note of allNotes) {
		pushEntity(
			nodes,
			note,
			xPosition,
			160,
			{ label: note.name, entityType: "notes" },
			"noteNode",
		);
		xPosition += 300;
	}

	const edges: Edge[] = [];
	for (const session of sessionConns) {
		for (const c of session.factions) {
			edges.push({
				id: `${c.sessionId}-${c.factionId}`,
				source: c.sessionId,
				target: c.factionId,
			});
		}
		for (const c of session.characters) {
			edges.push({
				id: `${c.sessionId}-${c.characterId}`,
				source: c.sessionId,
				target: c.characterId,
			});
		}
		for (const c of session.notes) {
			edges.push({
				id: `${c.sessionId}-${c.noteId}`,
				source: c.sessionId,
				target: c.noteId,
			});
		}
	}
	for (const char of charConns) {
		for (const c of char.factions) {
			edges.push({
				id: `${c.characterId}-${c.factionId}`,
				source: c.characterId,
				target: c.factionId,
			});
		}
		for (const c of char.notes) {
			edges.push({
				id: `${c.characterId}-${c.noteId}`,
				source: c.characterId,
				target: c.noteId,
			});
		}
	}
	for (const note of noteConns) {
		for (const c of note.factions) {
			edges.push({
				id: `${c.noteId}-${c.factionId}`,
				source: c.noteId,
				target: c.factionId,
			});
		}
	}

	return (
		<Container width="max">
			<div className="mx-auto w-11/12">
				<Header style="h1">Connection Map</Header>
			</div>
			<div className="w-full h-screen relative">
				<NodeCanvas initNodes={nodes} initEdges={edges} fitView />
			</div>
		</Container>
	);
}
