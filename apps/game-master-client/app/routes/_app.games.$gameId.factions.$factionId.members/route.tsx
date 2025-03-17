import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { type Params, useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createCharacterAction } from "~/queries/server/create-character.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { linkCharacter, unlinkCharacter } from "./actions.server";
import { MembersRoute } from "./members-route";

const getParams = (params: Params) => {
  return parseParams(params, { factionId: z.string(), gameId: z.string() });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId, factionId } = getParams(params);
  const { api } = await createApiFromReq(request);
  const members = await getData(() => api.factions.members(factionId));
  return { members, gameId, factionId };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId, gameId } = getParams(params);
  const { api } = await createApiFromReq(request);

  if (request.method === "POST") {
    return createCharacterAction(
      request,
      `/games/${gameId}/factions/${factionId}/members`,
    );
  }

  if (request.method === "PATCH") {
    return await linkCharacter(request, api, factionId);
  }

  if (request.method === "DELETE") {
    return await unlinkCharacter(request, api, factionId);
  }

  return methodNotAllowed();
};

export const useFactionMemberData = () => {
  const data = useRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.factions.$factionId.members",
  );

  if (data === undefined) {
    throw new Error(
      "useFactionMemberData must be used within the factions.$factionId.members route tree or its children",
    );
  }

  return data;
};

export { MembersRoute as default };
