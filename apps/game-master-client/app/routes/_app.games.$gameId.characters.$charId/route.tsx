import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { redirect, typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { updateCharacter } from "~/queries/server/update-character.server";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { deleteCharacter, duplicateCharacter } from "./actions.server";
import { CharacterLayout } from "./character-layout";

const getParams = (params: Params) => {
  return parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId, gameId } = getParams(params);
  const [characterDetails, charNotes, folders] = await resolve(
    getData(() => api.characters.getCharacter.withPermissions(charId)),
    getData(() => api.characters.notes(charId)),
    getData(() => api.folders.getGameFolders(gameId)),
  );

  if (characterDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/characters`);
  }

  return typedjson({ characterDetails, charNotes, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  const { charId } = getParams(params);

  if (request.method === "POST") {
    return duplicateCharacter(request, api, charId, userId);
  }

  if (request.method === "DELETE") {
    return deleteCharacter(api, charId);
  }

  if (request.method === "PATCH") {
    return updateCharacter(request, api, charId);
  }

  return methodNotAllowed();
};

export { CharacterLayout as default };

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
