import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useRouteError } from "@remix-run/react";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { GameNavbar } from "./components/game-navbar";
import { Text } from "~/components/ui/typeography";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const { characters, factions, notes } = await api.games.getAllGameEntities(gameId);
	return typedjson({ characters, factions, notes });
};

export default function GameLayout() {
	const { characters, factions, notes } = useTypedLoaderData<typeof loader>(); // TODO: Not currently used
	return (
		<div className="space-y-4">
			<GameNavbar />
			<div className="p-3">
				<Outlet />
			</div>
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

export function ErrorBoundary() {
	const error = useRouteError();
	console.error(error);
	return (
		<div className="w-4/5 mx-auto">
			<Text variant={"h3"}>Something went wrong</Text>
		</div>
	);
}
