import { useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components/container";
import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { CharacterTable } from "~/components/tables/character-table";
import { TableControlBar } from "~/components/tables/table-and-controls";
import { useEntitySearch } from "~/hooks/search";
import type { loader } from "./route";

export function CharacterIndex() {
  const { gameId, gameChars } = useTypedLoaderData<typeof loader>();
  const search = useEntitySearch(gameChars, {
    threshold: 0.3,
    keys: ["name", "race", "characterClass", "primaryFaction.name"],
  });
  return (
    <Container>
      <TableControlBar
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
      >
        <CreateCharacterSlideover gameId={gameId} />
      </TableControlBar>
      <CharacterTable characters={search.result} />
    </Container>
  );
}
