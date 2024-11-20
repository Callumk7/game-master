import { Cross2Icon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { Faction } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import { factionHref } from "~/util/generate-hrefs";

interface LinkedFactionListProps {
  characterId: string;
  factions: Faction[];
}

export function LinkedFactionList({ characterId, factions }: LinkedFactionListProps) {
  const submit = useSubmit();
  return (
    <div className="flex flex-col gap-2 p-4 rounded-md border w-fit">
      {factions.map((faction) => (
        <div key={faction.id} className="flex justify-between">
          <Link variant={"link"} href={factionHref(faction.gameId, faction.id)}>
            {faction.name}
          </Link>
          <Button
            variant={"ghost"}
            size={"icon"}
            onPress={() =>
              submit({ factionId: faction.id, characterId }, { method: "delete" })
            }
          >
            <Cross2Icon />
          </Button>
        </div>
      ))}
    </div>
  );
}
