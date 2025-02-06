import { useLoaderData } from "@remix-run/react";
import { LinkedFactionList } from "./components/faction-list";
import { LinkFactionDialog } from "./components/link-faction-dialog";
import { PrimaryFaction } from "./components/primary-faction";
import type { loader } from "./route";
import { Layout } from "~/components/layout";
import { FactionTable } from "~/components/tables/faction-table";

export function CharacterFactionsRoute() {
  const { charId, allFactions, charFactions, primaryFaction } =
    useLoaderData<typeof loader>();
  return (
    <Layout width="full" spacing={"normal"}>
      {primaryFaction ? (
        <PrimaryFaction faction={primaryFaction} members={primaryFaction.members} />
      ) : null}
      <LinkFactionDialog allFactions={allFactions} />
      {charFactions.length > 0 ? (
        <FactionTable factions={charFactions} />
      ) : null}
    </Layout>
  );
}
