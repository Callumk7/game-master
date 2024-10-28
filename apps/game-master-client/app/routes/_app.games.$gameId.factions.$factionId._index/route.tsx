import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorClient, EditorPreview } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { duplicateFactionSchema, updateFactionSchema } from "@repo/api";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { EntityToolbar } from "~/components/entity-toolbar";
import { validateUser } from "~/lib/auth.server";
import { createApi } from "~/lib/api.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { factionId, gameId } = parseParams(params, {
    factionId: z.string(),
    gameId: z.string(),
  });
  const userId = await validateUser(request);
  const api = createApi(userId);
  const factionDetails = await api.factions.getFactionWithPermissions(factionId);

  if (factionDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/factions`);
  }
  const folders = await api.folders.getGameFolders(factionDetails.gameId);
  return typedjson({ factionDetails, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId } = parseParams(params, { factionId: z.string() });
  const userId = await validateUser(request);
  const api = createApi(userId);
  if (request.method === "POST") {
    const userId = await validateUser(request);
    const data = await parseForm(request, duplicateFactionSchema.omit({ ownerId: true }));

    const dupeResult = await api.factions.duplicateFaction(factionId, {
      ...data,
      ownerId: userId,
    });

    if (!dupeResult.success) {
      return unsuccessfulResponse(dupeResult.message);
    }

    return redirect(`/games/${dupeResult.data.gameId}/factions/${dupeResult.data.id}`);
  }
  if (request.method === "PATCH") {
    const data = await parseForm(request, updateFactionSchema);

    const result = await api.factions.updateFactionDetails(factionId, data);

    return typedjson(result);
  }
  return methodNotAllowed();
};

export default function FactionDetailRoute() {
  const { factionDetails, folders } = useTypedLoaderData<typeof loader>();
  const { suggestionItems } = useGameData();
  return (
    <div className="p-4 space-y-4">
      <EntityToolbar
        entityOwnerId={factionDetails.ownerId}
        gameId={factionDetails.gameId}
        entityVisibility={factionDetails.visibility}
        permissions={factionDetails.permissions}
        userPermissionLevel={factionDetails.userPermissionLevel!}
        folders={folders}
      />
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
