import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useHref, useNavigate } from "@remix-run/react";
import { RouterProvider } from "react-aria-components";
import { validateUser } from "~/lib/auth.server";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { getUserAppData } from "./queries.server";
import { GameSidebar } from "./components/game-sidebar";
import { GameSelectionProvider } from "~/store/selection";
import { RightSidebarLayout } from "./components/right-sidebar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const { user, userData } = await getUserAppData(userId); // WARN: big data load on startup. There are better ways

  return typedjson({ user, userData });
};

export default function AppLayout() {
  const { userData } = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();

  const defaultGameId = userData[0]?.id ?? ""; // TODO: This is a temporary hack

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <GameSelectionProvider gameSelectionId={defaultGameId} isRightSidebarOpen={false}>
        <GameSidebar gamesWithAllEntities={userData} />
        <RightSidebarLayout>
          <Outlet />
        </RightSidebarLayout>
      </GameSelectionProvider>
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
