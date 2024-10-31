import { useTypedLoaderData } from "remix-typedjson";
import { CreateFactionSlideover } from "~/components/forms/create-faction";
import { FactionTable } from "~/components/tables/faction-table";
import type { loader } from "./route";

export function FactionsIndex() {
  const { gameId, gameFactions } = useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-2">
      <CreateFactionSlideover gameId={gameId} />
      <FactionTable factions={gameFactions} />
    </div>
  );
}
