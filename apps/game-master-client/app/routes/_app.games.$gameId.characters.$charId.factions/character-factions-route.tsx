import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { PrimaryFaction } from "./components/primary-faction";
import { LinkFactionDialog } from "./components/link-faction-dialog";
import { LinkedFactionList } from "./components/faction-list";

export function CharacterFactionsRoute() {
  const { charId, allFactions, charFactions, primaryFaction } =
    useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      {primaryFaction ? (
        <PrimaryFaction faction={primaryFaction} members={primaryFaction.members} />
      ) : null}
      <LinkFactionDialog allFactions={allFactions} />
      <LinkedFactionList characterId={charId} factions={charFactions} />
    </div>
  );
}
