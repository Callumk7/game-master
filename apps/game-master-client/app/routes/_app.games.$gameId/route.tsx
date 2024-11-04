import type { LoaderFunctionArgs } from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { Text } from "~/components/ui/typeography";
import { createApiFromReq } from "~/lib/api.server";
import type { MentionItem } from "~/types/mentions";
import { getData } from "~/util/handle-error";
import GameLayout from "./game-layout";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const { api } = await createApiFromReq(request);
  const data = await getData(() => api.games.getAllGameEntities(gameId));
  const sidebarData = await getData(() => api.games.getGame.withData(gameId));
  return typedjson({ ...data, sidebarData });
};

export { GameLayout as default };

export function useGameData() {
  const data = useTypedRouteLoaderData<typeof loader>("routes/_app.games.$gameId");

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

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="w-4/5 mx-auto">
      <Text variant={"h3"}>Something went wrong</Text>
    </div>
  );
}
