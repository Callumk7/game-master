import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { updateGame } from "./actions.server";
import { ManageGameRoute } from "./manage-game-route";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { gameId } = getParams(params);
  const gameData = await getData(() => api.games.getGame(gameId));
  return { game: gameData };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { gameId } = getParams(params);

  if (request.method === "POST") {
    return await updateGame(request, api, gameId);
  }

  return methodNotAllowed();
};

export { ManageGameRoute as default };
