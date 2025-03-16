import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Layout } from "~/components/layout";
import { CharacterTable } from "~/components/tables/character-table";
import { Text } from "~/components/ui/typeography";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { MembersToolbar } from "./components/members-toolbar";
import type { loader } from "./route";

export function MembersRoute() {
  const { factionDetails } = useFactionData();
  const { members } = useLoaderData<typeof loader>();
  return (
    <Layout width="full" spacing="wide">
      <Text variant={"h1"} weight={"bold"}>
        {factionDetails.name}: Members
      </Text>
      <MembersToolbar />
      <CharacterTable characters={members} />
    </Layout>
  );
}
