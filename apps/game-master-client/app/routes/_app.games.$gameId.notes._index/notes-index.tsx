import { useTypedLoaderData } from "remix-typedjson";
import { CreateNoteSlideover } from "~/components/forms/create-note";
import type { loader } from "./route";
import { NoteTable } from "~/components/tables/note-table";

export function NotesIndex() {
  const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <CreateNoteSlideover gameId={gameId} />
      <NoteTable notes={allGameNotes} />
    </>
  );
}
