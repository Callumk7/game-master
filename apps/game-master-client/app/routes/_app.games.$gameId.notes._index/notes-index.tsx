import { useTypedLoaderData } from "remix-typedjson";
import { CreateNoteSlideover } from "~/components/forms/create-note";
import { NoteTable } from "~/components/tables/note-table";
import type { loader } from "./route";
import { Container } from "~/components/container";

export function NotesIndex() {
  const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateNoteSlideover gameId={gameId} />
      <NoteTable notes={allGameNotes} />
    </Container>
  );
}
