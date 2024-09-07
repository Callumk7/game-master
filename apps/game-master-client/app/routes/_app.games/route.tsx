import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { GamesSidebar } from "./components/games-sidebar";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const ownedGames = await api.games.getOwnedGames(userId);
  return typedjson({ ownedGames });
};

export default function GamesLayout() {
  const { ownedGames } = useTypedLoaderData<typeof loader>();
  return (
    <div className="flex h-screen">
      <GamesSidebar games={ownedGames} />
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
}
