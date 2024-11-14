import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { redirect, typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { deleteFaction, duplicateFaction } from "./actions.server";
import { FactionLayout } from "./faction-layout";
import { updateFactionDetails } from "~/actions/factions.server";

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
    getData(() => api.factions.getFactionWithPermissions(factionId)),
    getData(() => api.folders.getGameFolders(gameId)),
  );

  if (factionDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/factions`);
  }

  return typedjson({ factionDetails, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId } = getParams(params);
  const { api, userId } = await createApiFromReq(request);

  if (request.method === "POST") {
    return duplicateFaction(request, api, factionId, userId);
  }

  if (request.method === "PATCH") {
    const result = await updateFactionDetails(request, factionId);
    return typedjson(result);
  }

  if (request.method === "DELETE") {
    return deleteFaction(api, factionId);
  }

  return methodNotAllowed();
};

export const useFactionData = () => {
  const data = useTypedRouteLoaderData<typeof loader>(
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
