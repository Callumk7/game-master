import { useTypedLoaderData } from "remix-typedjson";
import { FactionTable } from "~/components/tables/faction-table";
import { CreateFactionSlideover } from "./components/create-faction-slideover";
import type { loader } from "./route";
import { Container } from "~/components/container";

export function FactionsIndex() {
  const { gameId, gameFactions } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateFactionSlideover gameId={gameId} />
      <FactionTable factions={gameFactions} />
    </Container>
  );
}
