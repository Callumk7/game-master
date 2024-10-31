import { Outlet, useHref, useNavigate } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-aria-components";
import { useTypedLoaderData } from "remix-typedjson";
import { GlobalStateProvider } from "~/store/global";
import { GameSidebar } from "./components/game-sidebar";
import type { loader } from "./route";

export function AppLayout() {
  const { sidebarData } = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();

  const queryClient = new QueryClient();

  const defaultGameId = sidebarData.games[0]?.id ?? ""; // TODO: This is a temporary hack

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider gameSelectionId={defaultGameId}>
          <GameSidebar gamesWithAllEntities={sidebarData.games} />
          <div className="ml-64 flex-1">
            <Outlet />
          </div>
        </GlobalStateProvider>
      </QueryClientProvider>
    </RouterProvider>
  );
}
