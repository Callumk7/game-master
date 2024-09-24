import type { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { Link } from "~/components/ui/link";
import { api } from "~/lib/api.server";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });

	const allGameNotes = await api.notes.getAllGameNotes(gameId);

	return typedjson({ allGameNotes, gameId });
};

export default function NotesIndex() {
	const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<nav className="flex flex-col gap-3" aria-label="Notes list">
				{allGameNotes.map((note) => (
					<Link key={note.id} href={`/games/${gameId}/notes/${note.id}`} variant={"link"}>
						{note.name}
					</Link>
				))}
			</nav>
		</div>
	);
}
