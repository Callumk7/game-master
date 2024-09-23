import { Outlet } from "@remix-run/react";
import { GameNavbar } from "./components/game-navbar";
import { parseParams } from "zodix";
import { z } from "zod";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { api } from "~/lib/api.server";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const { characters, factions, notes } = await api.games.getAllGameEntities(gameId);
	return typedjson({ characters, factions, notes });
};

export default function GameLayout() {
	const { characters, factions, notes } = useTypedLoaderData<typeof loader>();
	return (
		<div className="space-y-4">
			<GameNavbar />
			<Outlet />
		</div>
	);
}

export function useGameData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.games.$gameId");
	if (data === undefined) {
		throw new Error(
			"useGameData must be used within the _app.games.$gameId route or its children",
		);
	}
	return data;
}
