import { Toolbar } from "~/components/ui/toolbar";
import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { Button } from "~/components/ui/button";
import { useFactionMemberData } from "../route";
import { AddMemberDialog } from "./add-member-dialog";

interface MembersToolbarProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export function MembersToolbar({ isEditing, setIsEditing }: MembersToolbarProps) {
  const { gameId, factionId } = useFactionMemberData();
  return (
    <Toolbar>
      <AddMemberDialog />
      <Button
        onPress={() => setIsEditing(!isEditing)}
        variant={isEditing ? "default" : "outline"}
      >
        {isEditing ? "Save" : "Edit"}
      </Button>
      <CreateCharacterSlideover gameId={gameId} factionId={factionId} />
    </Toolbar>
  );
}
