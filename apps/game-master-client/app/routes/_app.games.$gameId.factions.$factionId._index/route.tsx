import type { ActionFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { updateFactionDetails } from "./actions.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId } = parseParams(params, { factionId: z.string() });
  const result = await updateFactionDetails(request, factionId);
  return typedjson(result);
};

export default function FactionDetailRoute() {
  const { factionDetails } = useFactionData();
  const { suggestionItems } = useGameData();
  return (
    <div className="p-4 space-y-4">
      <div>
        <Pill size={"xs"} variant={"secondary"}>
          {`permission level: ${factionDetails.userPermissionLevel}`}
        </Pill>
        <EditableText
          method="patch"
          fieldName={"name"}
          value={factionDetails.name}
          variant={"h2"}
          weight={"semi"}
          inputLabel={"Game name input"}
          buttonLabel={"Edit game name"}
        />
      </div>
      {factionDetails.userPermissionLevel === "view" ? (
        <EditorPreview htmlContent={factionDetails.htmlContent ?? ""} />
      ) : (
        <EditorClient
          htmlContent={factionDetails.htmlContent ?? ""}
          suggestionItems={suggestionItems}
        />
      )}
    </div>
  );
}
