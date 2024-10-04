import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { NoteTable } from "./components/note-table";
import { CreateNoteSlideover } from "~/components/forms/create-note";
import { createNoteAction } from "~/queries/create-note";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });

  const allGameNotes = await api.notes.getAllGameNotes(gameId);

  return typedjson({ allGameNotes, gameId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return await createNoteAction(request);
  }

  return methodNotAllowed();
};

export default function NotesIndex() {
  const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <CreateNoteSlideover gameId={gameId} />
      <NoteTable notes={allGameNotes} />
    </div>
  );
}
