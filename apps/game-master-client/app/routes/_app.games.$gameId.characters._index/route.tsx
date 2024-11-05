import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createCharacterAction } from "~/queries/server/create-character.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { CharacterIndex } from "./characters-index";

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

  return methodNotAllowed();
};

export { CharacterIndex as default };
