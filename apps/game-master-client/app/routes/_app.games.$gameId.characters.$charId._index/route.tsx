import type { ActionFunctionArgs } from "react-router";
import type { Params } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { updateCharacter, updateLinkedNotes } from "./actions.server";
import { CharacterOverview } from "./character-overview";

const getParams = (params: Params) => {
  return parseParams(params, { charId: z.string() });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId } = getParams(params);

  if (request.method === "PATCH") {
    return await updateCharacter(request, api, charId);
  }

  if (request.method === "PUT") {
    return await updateLinkedNotes(request, api, charId);
  }

  return methodNotAllowed();
};

export { CharacterOverview as default };
