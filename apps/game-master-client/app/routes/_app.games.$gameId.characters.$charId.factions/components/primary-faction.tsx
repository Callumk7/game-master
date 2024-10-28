import type { Character, Faction } from "@repo/api";
import { CharacterTable } from "~/components/tables/character-table";
import { Text } from "~/components/ui/typeography";

interface PrimaryFactionProps {
  faction: Faction;
  members: Character[];
}

export function PrimaryFaction({ faction, members }: PrimaryFactionProps) {
  return (
    <div className="space-y-4">
      <Text variant={"h3"} weight={"bold"}>
        {faction.name}
      </Text>
      <CharacterTable characters={members} />
    </div>
  );
}
