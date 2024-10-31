import type { ActionFunctionArgs } from "@remix-run/node";
import { updateFactionSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorClient, EditorPreview } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed } from "~/util/responses";
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
      <EditableText
        method="patch"
        fieldName={"name"}
        value={factionDetails.name}
        variant={"h2"}
        weight={"semi"}
        inputLabel={"Game name input"}
        buttonLabel={"Edit game name"}
      />
      {factionDetails.userPermissionLevel === "view" ? (
        <>
          <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px] ">
            You have permission to view
          </span>
          <EditorPreview htmlContent={factionDetails.htmlContent ?? ""} />
        </>
      ) : (
        <EditorClient
          htmlContent={factionDetails.htmlContent ?? ""}
          suggestionItems={suggestionItems}
        />
      )}
    </div>
  );
}
