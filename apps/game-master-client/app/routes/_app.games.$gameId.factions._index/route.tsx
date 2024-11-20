import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { updateFactionDetails } from "~/actions/factions.server";
import { createApiFromReq } from "~/lib/api.server";
import { createFactionAction } from "~/queries/server/create-faction.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { FactionsIndex } from "./factions-index";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { gameId } = parseParams(params, { gameId: z.string() });

  const gameFactions = await getData(() => api.factions.forGame.withMembers(gameId));

  return typedjson({ gameId, gameFactions });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return createFactionAction(request);
  }
  if (request.method === "PATCH") {
    const { factionId } = await parseForm(request, { factionId: z.string() });
    const result = await updateFactionDetails(request, factionId);
    return typedjson(result);
  }

  return methodNotAllowed();
};

export { FactionsIndex as default };
