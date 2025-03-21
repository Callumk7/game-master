import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { type Params, useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { deleteFaction, updateFactionDetails } from "~/actions/factions.server";
import { createApiFromReq } from "~/lib/api.server";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { duplicateFaction } from "./actions.server";
import { FactionLayout } from "./faction-layout";

const getParams = (params: Params) => {
  return parseParams(params, {
    factionId: z.string(),
    gameId: z.string(),
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { factionId, gameId } = getParams(params);

  const [factionDetails, folders] = await resolve(
    getData(() => api.factions.getFaction.withPermissions(factionId)),
    getData(() => api.folders.getGameFolders(gameId)),
  );

  if (factionDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/factions`);
  }

  return { factionDetails, folders };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId, gameId } = getParams(params);
  const { api, userId } = await createApiFromReq(request);

  if (request.method === "POST") {
    return duplicateFaction(request, api, factionId, userId);
  }

  if (request.method === "PATCH") {
    const result = await updateFactionDetails(request, factionId);
    return result;
  }

  if (request.method === "DELETE") {
    return deleteFaction(api, factionId, gameId);
  }

  return methodNotAllowed();
};

export const useFactionData = () => {
  const data = useRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.factions.$factionId",
  );

  if (data === undefined) {
    throw new Error(
      "useFactionData must be used within the factions.$factionId route tree or its children",
    );
  }

  return data;
};

export { FactionLayout as default };
