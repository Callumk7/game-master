import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useHref, useNavigate, useRouteError } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-aria-components";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { Text } from "~/components/ui/typeography";
import { validateUser } from "~/lib/auth.server";
import { GlobalStateProvider } from "~/store/global";
import { GameSidebar } from "./components/game-sidebar";
import { createApi } from "~/lib/api.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Game Master: Notes for Heroes" },
    {
      name: "description",
      content: "Take your notes to the next level with Game Master",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const sidebarData = await api.users.getAllUserGamesWithSidebarData(userId);
  const serverUrl = process.env.SERVER_URL!;

  return typedjson({ sidebarData, serverUrl, userId });
};

export default function AppLayout() {
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

export function useAppData() {
  const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
  if (data === undefined) {
    throw new Error("useAppData must be used within the _app route or its children");
  }
  return data;
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
