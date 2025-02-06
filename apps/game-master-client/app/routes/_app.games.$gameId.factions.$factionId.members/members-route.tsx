import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Text } from "~/components/ui/typeography";
import type { loader } from "./route";
import { Layout } from "~/components/layout";
import { MembersToolbar } from "./components/members-toolbar";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { CharacterTable } from "~/components/tables/character-table";

export function MembersRoute() {
  const { factionDetails } = useFactionData();
  const { members } = useLoaderData<typeof loader>();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Layout width="full" spacing="wide">
      <Text variant={"h1"} weight={"bold"}>
        {factionDetails.name}: Members
      </Text>
      <MembersToolbar isEditing={isEditing} setIsEditing={setIsEditing} />
      <CharacterTable characters={members} />
    </Layout>
  );
}
