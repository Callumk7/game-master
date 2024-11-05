import { useTypedLoaderData } from "remix-typedjson";
import { CreateNoteSlideover } from "~/components/forms/create-note";
import { NoteTable } from "./components/note-table";
import type { loader } from "./route";

export function NotesIndex() {
  const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <CreateNoteSlideover gameId={gameId} />
      <NoteTable notes={allGameNotes} />
    </>
  );
}
