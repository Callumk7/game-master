import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { methodNotAllowed } from "~/util/responses";
import { CreateFactionSlideover } from "~/components/forms/create-faction";
import { FactionTable } from "./components/faction-table";
import { createFactionAction } from "~/queries/server/create-faction.server";
import { validateUser } from "~/lib/auth.server";
import { createApi } from "~/lib/api.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { gameId } = parseParams(params, { gameId: z.string() });

  const gameFactions = await api.factions.getAllGameFactions(gameId);

  return typedjson({ gameId, gameFactions });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return createFactionAction(request);
  }

  return methodNotAllowed();
};

export default function CharacterIndex() {
  const { gameId, gameFactions } = useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-2">
      <CreateFactionSlideover gameId={gameId} />
      <FactionTable factions={gameFactions} />
    </div>
  );
}
