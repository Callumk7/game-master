import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { CreateCharacterSlideover } from "~/components/forms/create-character";
import { CharacterTable } from "~/components/tables/character-table";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { createCharacterAction } from "~/queries/server/create-character.server";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const userId = await validateUser(request);
  const api = createApi(userId);

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
    <div className="space-y-2">
      <CreateCharacterSlideover gameId={gameId} />
      <CharacterTable characters={gameChars} />
    </div>
  );
}
