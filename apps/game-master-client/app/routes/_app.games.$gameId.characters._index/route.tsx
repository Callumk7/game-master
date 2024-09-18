import type { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });

	const gameChars = await api.characters.getAllGameCharacters(gameId);

	return typedjson({ gameChars });
};

export default function CharacterIndex() {
	const { gameChars } = useTypedLoaderData<typeof loader>();
	return (
		<div>
      {gameChars.map(char => (
        <p key={char.id}>{char.name}</p>
      ))}
		</div>
	);
}
