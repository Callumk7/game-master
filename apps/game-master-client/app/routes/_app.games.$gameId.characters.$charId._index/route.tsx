import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import type { Params } from "@remix-run/react";
import { linkNoteToCharacter, updateCharacter } from "./actions.server";
import CharacterRoute from "./character-route";

const getParams = (params: Params) => {
  return parseParams(params, { charId: z.string() });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId } = getParams(params);

  if (request.method === "PATCH") {
    return await updateCharacter(request, api, charId);
  }

  if (request.method === "POST") {
    return await linkNoteToCharacter(request, api, charId);
  }

  return methodNotAllowed();
};

export { CharacterRoute as default };
