import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditableText, Text } from "~/components/ui/typeography";
import { createApi, createApiFromReq } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
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
  const game = await getData(() => api.games.getGameWithMembers(gameId));
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
