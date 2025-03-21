import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { removeMember, updateGameMembers, updateMemberDetails } from "./actions.server";
import { MembersRoute } from "./members-route";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() }).gameId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const gameId = getParams(params);
  const game = await getData(() => api.games.getGame.withMembers(gameId));

  return { game };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const gameId = getParams(params);

  if (request.method === "PATCH") {
    return await updateMemberDetails(request, api, gameId);
  }

  if (request.method === "PUT") {
    return await updateGameMembers(request, api, gameId);
  }

  if (request.method === "DELETE") {
    return await removeMember(request, api, gameId);
  }
  return methodNotAllowed();
};

export { MembersRoute as default };
