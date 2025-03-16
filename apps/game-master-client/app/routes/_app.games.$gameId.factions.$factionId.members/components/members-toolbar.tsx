import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { Toolbar } from "~/components/ui/toolbar";
import { useFactionMemberData } from "../route";
import { AddMemberDialog } from "./add-member-dialog";

export function MembersToolbar() {
  const { gameId, factionId } = useFactionMemberData();
  return (
    <Toolbar>
      <AddMemberDialog />
      <CreateCharacterSlideover gameId={gameId} factionId={factionId} />
    </Toolbar>
  );
}
