import { useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components/container";
import { FactionTable } from "~/components/tables/faction-table";
import { CreateFactionSlideover } from "./components/create-faction-slideover";
import type { loader } from "./route";

export function FactionsIndex() {
  const { gameId, gameFactions } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateFactionSlideover gameId={gameId} />
      <FactionTable factions={gameFactions} />
    </Container>
  );
}
