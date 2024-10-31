import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/typeography";

interface MemberCardProps {
  characterId: string;
  name: string;
  role?: string | null;
  coverImage?: string;
  isEditing: boolean;
}
export function MemberCard({
  characterId,
  name,
  role,
  coverImage,
  isEditing,
}: MemberCardProps) {
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
