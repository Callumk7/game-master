import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  type Params,
  ShouldRevalidateFunction,
  redirect,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { Text } from "~/components/ui/typeography";
import { createApiFromReq } from "~/lib/api.server";
import type { MentionItem } from "~/types/mentions";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import GameLayout from "./game-layout";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() }).gameId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const gameId = getParams(params);
  const { api } = await createApiFromReq(request);
  const data = await getData(() => api.games.getAllGameEntities(gameId));
  const sidebarData = await getData(() => api.games.getGame.withData(gameId));
  return { ...data, sidebarData };
};

export { GameLayout as default };

export function useGameData() {
  const data = useRouteLoaderData<typeof loader>("routes/_app.games.$gameId");

  if (data === undefined) {
    throw new Error(
      "useGameData must be used within the _app.games.$gameId route or its children",
    );
  }

  const suggestionItems = (): MentionItem[] => {
    const items: MentionItem[] = [];
    data.notes.map((note) => {
      items.push({
        id: note.id,
        label: note.name,
        href: `/games/${note.gameId}/notes/${note.id}`,
      });
    });

    data.characters.map((char) => {
      items.push({
        id: char.id,
        label: char.name,
        href: `/games/${char.gameId}/characters/${char.id}`,
      });
    });

    data.factions.map((faction) => {
      items.push({
        id: faction.id,
        label: faction.name,
        href: `/games/${faction.gameId}/factions/${faction.id}`,
      });
    });

    return items;
  };
  return { ...data, suggestionItems };
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const gameId = getParams(params);
  const { api } = await createApiFromReq(request);
  if (request.method === "DELETE") {
    const result = await api.games.delete(gameId);
    if (result.success) return redirect("/");
    return result;
  }
  return methodNotAllowed();
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="mx-auto w-4/5">
      <Text variant={"h3"}>Something went wrong</Text>
      <Text variant={"p"}>{String(error)}</Text>
    </div>
  );
}
