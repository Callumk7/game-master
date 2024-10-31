import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { duplicateFactionSchema, updateFactionSchema } from "@repo/api";
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityToolbar } from "~/components/entity-toolbar";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { factionHref } from "~/util/generate-hrefs";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { FactionNavigation } from "./components/navigation";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { factionId, gameId } = parseParams(params, {
    factionId: z.string(),
    gameId: z.string(),
  });
  const userId = await validateUser(request);
  const api = createApi(userId);
  const factionDetails = await api.factions.getFactionWithPermissions(factionId);

  if (factionDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/factions`);
  }
  const folders = await api.folders.getGameFolders(factionDetails.gameId);
  return typedjson({ factionDetails, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId } = parseParams(params, { factionId: z.string() });
  const userId = await validateUser(request);
  const api = createApi(userId);
  if (request.method === "POST") {
    const userId = await validateUser(request);
    const data = await parseForm(request, duplicateFactionSchema.omit({ ownerId: true }));

    const dupeResult = await api.factions.duplicateFaction(factionId, {
      ...data,
      ownerId: userId,
    });

    if (!dupeResult.success) {
      return unsuccessfulResponse(dupeResult.message);
    }

    const { gameId, id } = dupeResult.data;
    return redirect(factionHref(gameId, id));
  }
  if (request.method === "PATCH") {
    const data = await parseForm(request, updateFactionSchema);

    const result = await api.factions.updateFactionDetails(factionId, data);

    return typedjson(result);
  }
  return methodNotAllowed();
};

export default function FactionsRoute() {
  const { factionDetails, folders } = useTypedLoaderData<typeof loader>();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center w-full justify-between">
        <FactionNavigation gameId={factionDetails.gameId} factionId={factionDetails.id} />
        <EntityToolbar
          entityOwnerId={factionDetails.ownerId}
          gameId={factionDetails.gameId}
          entityVisibility={factionDetails.visibility}
          permissions={factionDetails.permissions}
          userPermissionLevel={factionDetails.userPermissionLevel!}
          folders={folders}
        />
      </div>
      <Outlet />
    </div>
  );
}

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
