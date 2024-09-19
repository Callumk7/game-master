import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { validateUser } from "~/lib/auth.server";
import { Link } from "~/components/ui/link";
import { CreateCharacterSlideover } from "~/components/forms/create-character";
import { createCharacterAction } from "~/queries/create-character";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });

	const gameChars = await api.characters.getAllGameCharacters(gameId);

	return typedjson({ gameId, gameChars });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
    return createCharacterAction(request);
	}

	return methodNotAllowed();
};

export default function CharacterIndex() {
	const { gameId, gameChars } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<CreateCharacterSlideover gameId={gameId} />
			<div className="flex flex-col gap-2 items-start">
				{gameChars.map((char) => (
					<Link
						variant={"link"}
						href={`/games/${gameId}/characters/${char.id}`}
						key={char.id}
					>
						{char.name}
					</Link>
				))}
			</div>
		</div>
	);
}
