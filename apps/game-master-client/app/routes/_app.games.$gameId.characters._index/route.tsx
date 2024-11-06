import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createCharacterAction } from "~/queries/server/create-character.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { CharacterIndex } from "./characters-index";
import { updateCharacter } from "~/queries/server/update-character.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const { api } = await createApiFromReq(request);

  const gameChars = await getData(() =>
    api.characters.getForGame.withPrimaryFactions(gameId),
  );

  return typedjson({ gameId, gameChars });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return createCharacterAction(request);
  }

  if (request.method === "PATCH") {
    const { api } = await createApiFromReq(request);
    const { charId } = await parseForm(request, { charId: z.string() });
    return updateCharacter(request, api, charId);
  }

  return methodNotAllowed();
};

export { CharacterIndex as default };
