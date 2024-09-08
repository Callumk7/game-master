import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseFormSafe, zx } from "zodix";
import { Text } from "~/ui/typeography";
import { api } from "~/lib/api.server";
import { NewNoteForm } from "./components/new-note";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = zx.parseParams(params, { gameId: z.string() });
  const game = await api.games.getGame(gameId);
  console.log(game);

  return typedjson({ game });
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const { gameId } = zx.parseParams(params, { gameId: z.string() });
  const userId = await validateUser(request);
  const result = await parseFormSafe(request, { name: z.string() });
  if (!result.success) {
    return typedjson({ someError: "message" });
  }

  const newGame = await api.notes.createNote({
    name: result.data.name,
    ownerId: userId,
    type: "note",
    gameId,
    htmlContent: "<p>Hello World</p>",
  });

  if (newGame.success) {
    return typedjson(newGame.data);
  }

  return new Response("Ops");
};

export default function GameRoute() {
  const { game } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <Text variant={"h1"}>{game.name}</Text>
        <Text>{game.id}</Text>
      <NewNoteForm gameId={game.id} />
    </div>
  );
}
