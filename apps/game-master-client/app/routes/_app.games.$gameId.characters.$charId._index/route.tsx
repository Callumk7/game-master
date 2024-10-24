import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody, EditorPreview } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { duplicateCharacterSchema, updateCharacterSchema } from "@repo/api";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { EntityToolbar } from "~/components/entity-toolbar";
import { validateUser } from "~/lib/auth.server";
import { createApi } from "~/lib/api.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { charId, gameId } = parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
  const characterDetails = await api.characters.getCharacterWithPermissions(charId);

  if (characterDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/characters`);
  }

  const folders = await api.folders.getGameFolders(characterDetails.gameId);
  return typedjson({ characterDetails, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { charId } = parseParams(params, { charId: z.string() });

  if (request.method === "POST") {
    const userId = await validateUser(request);
    const data = await parseForm(
      request,
      duplicateCharacterSchema.omit({ ownerId: true }),
    );

    const dupeResult = await api.characters.duplicateCharacter(charId, {
      ...data,
      ownerId: userId,
    });

    if (!dupeResult.success) {
      return unsuccessfulResponse(dupeResult.message);
    }

    return redirect(`/games/${dupeResult.data.gameId}/characters/${dupeResult.data.id}`);
  }

  if (request.method === "PATCH") {
    const data = await parseForm(request, updateCharacterSchema);

    const result = await api.characters.updateCharacterDetails(charId, data);

    if (!result.success) {
      return new Response("Error");
    }

    return typedjson(result);
  }

  return methodNotAllowed();
};

export default function CharacterRoute() {
  const { characterDetails, folders } = useTypedLoaderData<typeof loader>();
  const { suggestionItems } = useGameData();
  return (
    <div className="p-4 space-y-4">
      <EntityToolbar
        entityOwnerId={characterDetails.ownerId}
        gameId={characterDetails.gameId}
        entityVisibility={characterDetails.visibility}
        permissions={characterDetails.permissions}
        userPermissionLevel={characterDetails.userPermissionLevel!}
        folders={folders}
      />
      <EditableText
        method="patch"
        fieldName={"name"}
        value={characterDetails.name}
        variant={"h2"}
        weight={"semi"}
        inputLabel={"Game name input"}
        buttonLabel={"Edit game name"}
      />
      {characterDetails.userPermissionLevel === "view" ? (
        <>
          <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px] ">
            You have permission to view
          </span>
          <EditorPreview htmlContent={characterDetails.htmlContent ?? ""} />
        </>
      ) : (
        <EditorBody
          htmlContent={characterDetails.htmlContent ?? ""}
          suggestionItems={suggestionItems}
        />
      )}
    </div>
  );
}
