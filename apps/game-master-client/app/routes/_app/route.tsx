import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useHref, useNavigate } from "@remix-run/react";
import { RouterProvider } from "react-aria-components";
import { validateUser } from "~/lib/auth.server";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { GameSidebar } from "./components/game-sidebar";
import { GameSelectionProvider } from "~/store/selection";
import { ThemeProvider } from "~/components/context/dark-mode";
import { api } from "~/lib/api.server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
	const sidebarData = await api.users.getAllUserGamesWithSidebarData(userId);

	return typedjson({ sidebarData });
};

export default function AppLayout() {
	const { sidebarData } = useTypedLoaderData<typeof loader>();
	const navigate = useNavigate();

	const queryClient = new QueryClient();

	const defaultGameId = sidebarData.games[0]?.id ?? ""; // TODO: This is a temporary hack

	return (
		<RouterProvider navigate={navigate} useHref={useHref}>
			<QueryClientProvider client={queryClient}>
				<GameSelectionProvider gameSelectionId={defaultGameId}>
					<ThemeProvider>
						<GameSidebar gamesWithAllEntities={sidebarData.games} />
            <div className="ml-64">
              <Outlet />
            </div>
					</ThemeProvider>
				</GameSelectionProvider>
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
