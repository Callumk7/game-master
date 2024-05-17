import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { allUserDataSchema, createDrizzleForTurso, getAllUserEntities } from "@repo/db";
import { useState } from "react";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { MainContainer, SidebarLayout } from "~/components/layout";
import { Sidebar } from "~/components/sidebar";
import { validateUserSession, getUserId, commitSession } from "~/lib/auth";
import { createApi } from "~/lib/game-master";
import { getAllUserData } from "./queries.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "Game Master" },
		{
			name: "description",
			content: "Create the game of your dreams.",
		},
	];
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const session = await validateUserSession(request);
	const userId = getUserId(session);

	const userData = await getAllUserData(userId, context);

	const error = session.get("error") || null;

	return typedjson(
		{
			userId,
			error,
			...userData,
		},
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		},
	);
};

// Custom hook to access _app loader data anywhere in the tree.
// Note, this is not currently revalidated, so it isn't a particularly
// good solution at the moment. It also isn't very remix'y. Probably a
// better solution somewhere.
export function useAppData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
	if (data === undefined) {
		throw new Error("useAppData must be used within the _app route or its children");
	}
	return data;
}

export default function AppRoute() {
	const { allCharacters, allFactions, allFolders, allPlots, allSessions, unsortedNotes } =
		useTypedLoaderData<typeof loader>();

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<SidebarLayout
			isSidebarOpen={isSidebarOpen}
			sidebar={
				<Sidebar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
					characters={allCharacters}
					factions={allFactions}
					notes={unsortedNotes}
					folders={allFolders}
					plots={allPlots}
					sessions={allSessions}
				/>
			}
		>
			<Outlet />
		</SidebarLayout>
	);
}
