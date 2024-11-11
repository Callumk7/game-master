import { useTypedLoaderData } from "remix-typedjson";
import { LinkedFactionList } from "./components/faction-list";
import { LinkFactionDialog } from "./components/link-faction-dialog";
import { PrimaryFaction } from "./components/primary-faction";
import type { loader } from "./route";

export function CharacterFactionsRoute() {
  const { charId, allFactions, charFactions, primaryFaction } =
    useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      {primaryFaction ? (
        <PrimaryFaction faction={primaryFaction} members={primaryFaction.members} />
      ) : null}
      <LinkFactionDialog allFactions={allFactions} />
      {charFactions.length > 0 ? (
        <LinkedFactionList characterId={charId} factions={charFactions} />
      ) : null}
    </div>
  );
}
