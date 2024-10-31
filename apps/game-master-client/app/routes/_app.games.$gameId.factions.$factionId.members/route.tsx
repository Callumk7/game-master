import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useSubmit, type Params } from "@remix-run/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/typeography";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

const getParams = (params: Params) => {
  return parseParams(params, { factionId: z.string() }).factionId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const factionId = getParams(params);
  const userId = await validateUser(request);
  const api = createApi(userId);
  const members = await api.factions.getFactionMembers(factionId);
  return typedjson({ members });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const factionId = getParams(params);
  const userId = await validateUser(request);
  const api = createApi(userId);
  if (request.method === "DELETE") {
    const { characterId } = await parseForm(request, { characterId: z.string() });
    await api.characters.unlinkFaction(characterId, factionId);
    return null;
  }
};

export default function MembersRoute() {
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

interface MemberCardProps {
  characterId: string;
  name: string;
  role?: string | null;
  coverImage?: string;
  isEditing: boolean;
}
function MemberCard({ characterId, name, role, coverImage, isEditing }: MemberCardProps) {
  const submit = useSubmit();
  const handleRemove = () => {
    submit({ characterId }, { method: "DELETE" });
  };
  return (
    <Card className="p-6 relative">
      <Button
        className={"absolute top-2 right-2"}
        size={"icon"}
        variant={isEditing ? "destructive" : "ghost"}
        onPress={isEditing ? handleRemove : undefined}
      >
        {isEditing ? <TrashIcon /> : <GearIcon />}
      </Button>
      <Text variant={"h4"}>{name}</Text>
      <Text>{role}</Text>
    </Card>
  );
}
