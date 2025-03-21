import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { unlinkFaction, updateCharacterFaction } from "./actions.server";
import { CharacterFactionsRoute } from "./character-factions-route";

export const getParams = (params: Params) => {
  return parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId, gameId } = getParams(params);
  const [charFactions, primaryFaction, allFactions] = await resolve(
    getData(() => api.characters.factions.withMembers(charId)),
    getData(() => api.characters.factions.primary(charId)),
    getData(() => api.factions.forGame(gameId)),
  );

  return { charId, charFactions, allFactions, primaryFaction };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { charId } = getParams(params);
  const { api } = await createApiFromReq(request);

  if (request.method === "POST") {
    return updateCharacterFaction(request, api, charId);
  }

  if (request.method === "DELETE") {
    return unlinkFaction(request, api, charId);
  }

  return methodNotAllowed();
};

export { CharacterFactionsRoute as default };
