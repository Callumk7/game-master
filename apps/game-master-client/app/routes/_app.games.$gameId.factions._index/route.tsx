import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { deleteFaction, updateFactionDetails } from "~/actions/factions.server";
import { createApiFromReq } from "~/lib/api.server";
import { createFactionAction } from "~/queries/server/create-faction.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { FactionsIndex } from "./factions-index";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() }).gameId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const gameId = getParams(params);

  const gameFactions = await getData(() => api.factions.forGame.withMembers(gameId));

  return { gameId, gameFactions };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const gameId = getParams(params);
  if (request.method === "POST") {
    return createFactionAction(request);
  }
  if (request.method === "PATCH") {
    const { factionId } = await parseForm(request, { factionId: z.string() });
    const result = await updateFactionDetails(request, factionId);
    return result;
  }

  if (request.method === "DELETE") {
    const { api } = await createApiFromReq(request);
    const { entityId } = await parseForm(request, { entityId: z.string() });
    return await deleteFaction(api, entityId, gameId);
  }

  return methodNotAllowed();
};

export { FactionsIndex as default };
