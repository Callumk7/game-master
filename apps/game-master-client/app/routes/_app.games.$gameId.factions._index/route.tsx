import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createFactionAction } from "~/queries/server/create-faction.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { FactionsIndex } from "./factions-index";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { gameId } = parseParams(params, { gameId: z.string() });

  const gameFactions = await getData(() =>
    api.factions.forGame.withMembers(gameId),
  );

  return typedjson({ gameId, gameFactions });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return createFactionAction(request);
  }

  return methodNotAllowed();
};

export { FactionsIndex as default };
