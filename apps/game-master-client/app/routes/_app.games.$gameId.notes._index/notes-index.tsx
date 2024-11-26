import { useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components/container";
import { CreateNoteSlideover } from "~/components/forms/create-note-dialog";
import { NoteTable } from "~/components/tables/note-table";
import { TableControlBar } from "~/components/tables/table-and-controls";
import { useEntitySearch } from "~/hooks/search";
import type { loader } from "./route";

export function NotesIndex() {
  const { allGameNotes, gameId } = useTypedLoaderData<typeof loader>();
  const search = useEntitySearch(allGameNotes, {
    threshold: 0.3,
    keys: ["name", "type"],
  });
  return (
    <Container>
      <TableControlBar
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
      >
        <CreateNoteSlideover gameId={gameId} />
      </TableControlBar>
      <NoteTable notes={search.result} />
    </Container>
  );
}
