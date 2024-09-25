import type { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { Link } from "~/components/ui/link";
import { api } from "~/lib/api.server";
import { NoteTable } from "./components/table";
import { useAppData } from "../_app/route";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });

	const allGameNotes = await api.notes.getAllGameNotes(gameId);

	return typedjson({ allGameNotes, gameId });
};

export default function NotesIndex() {
	const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  const appData = useAppData();
  const game = appData.userData.find(game => game.id === gameId);
	return (
		<div>
      <NoteTable notes={allGameNotes} />
		</div>
	);
}
