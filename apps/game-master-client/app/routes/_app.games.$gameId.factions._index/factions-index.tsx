import { Container } from "~/components/container";
import { FactionTable } from "~/components/tables/faction-table";
import { TableControlBar } from "~/components/tables/table-and-controls";
import { useEntitySearch } from "~/hooks/search";
import { CreateFactionSlideover } from "./components/create-faction-slideover";
import type { loader } from "./route";
import { useLoaderData } from "@remix-run/react";

export function FactionsIndex() {
  const { gameId, gameFactions } = useLoaderData<typeof loader>();
  const search = useEntitySearch(gameFactions, {
    threshold: 0.3,
    keys: ["name", "members.name"],
  });
  return (
    <Container>
      <TableControlBar
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
      >
        <CreateFactionSlideover gameId={gameId} />
      </TableControlBar>
      <FactionTable factions={search.result} />
    </Container>
  );
}
