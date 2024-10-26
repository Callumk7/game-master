import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { duplicateCharacterSchema, updateCharacterSchema } from "@repo/api";
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityToolbar } from "~/components/entity-toolbar";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { CharacterNavigation } from "./components/navigation";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { charId, gameId } = parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
  const characterDetails = await api.characters.getCharacterWithPermissions(charId);
  const charNotes = await api.characters.getNotes(charId);

  if (characterDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/characters`);
  }

  const folders = await api.folders.getGameFolders(characterDetails.gameId);
  return typedjson({ characterDetails, charNotes, folders });
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
  return (
    <div className="space-y-4">
      <div className="flex items-center w-full justify-between">
        <CharacterNavigation
          charId={characterDetails.id}
          gameId={characterDetails.gameId}
        />
        <EntityToolbar
          entityOwnerId={characterDetails.ownerId}
          gameId={characterDetails.gameId}
          entityVisibility={characterDetails.visibility}
          permissions={characterDetails.permissions}
          userPermissionLevel={characterDetails.userPermissionLevel!}
          folders={folders}
        />
      </div>
      <Outlet />
    </div>
  );
}

export const useCharacterData = () => {
  const data = useTypedRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.characters.$charId",
  );

  if (data === undefined) {
    throw new Error(
      "useCharacterData must be used within the characters.$charId route tree or its children",
    );
  }

  return data;
};
