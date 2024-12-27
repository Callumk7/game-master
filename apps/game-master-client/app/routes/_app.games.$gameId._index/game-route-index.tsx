import { useLoaderData } from "@remix-run/react";
import { EditableText, Text } from "~/components/ui/typeography";
import type { loader } from "./route";

export function GameRoute() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <div className="p-4 space-y-10">
      <div>
        <EditableText
          method="patch"
          fieldName={"name"}
          value={game.name}
          variant={"h2"}
          weight={"bold"}
          inputLabel={"Game name input"}
          buttonLabel={"Edit game name"}
        />
        <p className="whitespace-pre-wrap">{game.description}</p>
      </div>
      <div>
        <Text variant={"h2"} weight={"semi"}>
          Activity
        </Text>
        <p>Feature coming soon...</p>
      </div>
    </div>
  );
}
