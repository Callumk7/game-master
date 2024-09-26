import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { createFactionAction } from "~/queries/create-faction";
import { CreateFactionSlideover } from "~/components/forms/create-faction";
import { FactionTable } from "./components/faction-table";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });

	const gameFactions = await api.factions.getAllGameFactions(gameId);

	return typedjson({ gameId, gameFactions });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		return createFactionAction(request);
	}

	return methodNotAllowed();
};

export default function CharacterIndex() {
	const { gameId, gameFactions } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<CreateFactionSlideover gameId={gameId} />
			<FactionTable factions={gameFactions} />
		</div>
	);
}
