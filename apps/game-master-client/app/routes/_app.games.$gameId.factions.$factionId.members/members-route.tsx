import { useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/typeography";
import { MemberCard } from "./components/member-card";
import type { loader } from "./route";

export function MembersRoute() {
  const { members } = useTypedLoaderData<typeof loader>();
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
