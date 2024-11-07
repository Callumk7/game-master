import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createCharacterAction } from "~/queries/server/create-character.server";
import {
  deleteCharacter,
  updateCharacter,
} from "~/queries/server/update-character.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { CharacterIndex } from "./characters-index";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() }).gameId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const gameId = getParams(params);
  const { api } = await createApiFromReq(request);

  const gameChars = await getData(() =>
    api.characters.getForGame.withPrimaryFactions(gameId),
  );

  return typedjson({ gameId, gameChars });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const gameId = getParams(params);
  const { api } = await createApiFromReq(request);
  if (request.method === "POST") {
    return createCharacterAction(request);
  }

  if (request.method === "PATCH") {
    const { charId } = await parseForm(request, { charId: z.string() });
    return updateCharacter(request, api, charId);
  }

  if (request.method === "DELETE") {
    const { entityId } = await parseForm(request, { entityId: z.string() });
    return deleteCharacter(api, entityId, gameId);
  }

  return methodNotAllowed();
};

export { CharacterIndex as default };
