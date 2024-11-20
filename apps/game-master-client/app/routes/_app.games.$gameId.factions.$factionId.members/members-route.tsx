import { useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/typeography";
import { AddMemberDialog } from "./components/add-member-dialog";
import { MemberCard } from "./components/member-card";
import type { loader } from "./route";

export function MembersRoute() {
  const { members, gameId, factionId } = useTypedLoaderData<typeof loader>();
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="space-y-4">
      <Text variant={"h1"} weight={"bold"}>
        Members
      </Text>
      <Button
        onPress={() => setIsEditing(!isEditing)}
        variant={isEditing ? "default" : "outline"}
      >
        {isEditing ? "Save" : "Edit"}
      </Button>
      <AddMemberDialog allCharacters={[]} />
      <CreateCharacterSlideover gameId={gameId} factionId={factionId} />
      <div className="grid grid-cols-4 gap-3">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            characterId={member.id}
            name={member.name}
            role={member.role}
            isEditing={isEditing}
          />
        ))}
      </div>
    </div>
  );
}
