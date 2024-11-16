import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { unlinkCharacter } from "./actions.server";
import { MembersRoute } from "./members-route";

const getParams = (params: Params) => {
  return parseParams(params, { factionId: z.string() }).factionId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const factionId = getParams(params);
  const { api } = await createApiFromReq(request);
  const members = await getData(() => api.factions.members(factionId));
  return typedjson({ members });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const factionId = getParams(params);
  const { api } = await createApiFromReq(request);

  if (request.method === "DELETE") {
    return await unlinkCharacter(request, api, factionId);
  }

  return methodNotAllowed();
};

export { MembersRoute as default };
