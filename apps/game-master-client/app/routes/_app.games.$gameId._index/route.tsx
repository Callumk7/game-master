import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { Params } from "react-router";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { updateGameDetails } from "./actions.server";
import { GameRoute } from "./game-route-index";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId } = getParams(params);
  const { api } = await createApiFromReq(request);
  const game = await getData(() => api.games.getGame.withMembers(gameId));
  return typedjson({ game });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { gameId } = getParams(params);
  const { api } = await createApiFromReq(request);
  if (request.method === "PATCH") {
    return await updateGameDetails(request, gameId, api);
  }

  return methodNotAllowed();
};

export { GameRoute as default };
