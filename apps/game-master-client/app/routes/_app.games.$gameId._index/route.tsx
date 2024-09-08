import type { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { api } from "~/lib/api.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = zx.parseParams(params, { gameId: z.string() });
  const game = await api.games.getGame(gameId);

  return typedjson({ game });
};

export default function GameRoute() {
  const { game } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-bold text-xl">{game.name}</h1>
    </div>
  );
}
