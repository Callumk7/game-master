import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createNoteAction } from "~/queries/server/create-note.server";
import { methodNotAllowed } from "~/util/responses";
import { createApiFromReq } from "~/lib/api.server";
import type { Params } from "@remix-run/react";
import { getData } from "~/util/handle-error";
import { NotesIndex } from "./notes-index";

const getParams = (params: Params) => {
  return parseParams(params, { gameId: z.string() }).gameId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const gameId = getParams(params);

  const allGameNotes = await getData(() => api.notes.getAllGameNotes(gameId));

  return typedjson({ allGameNotes, gameId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return await createNoteAction(request);
  }

  return methodNotAllowed();
};

export { NotesIndex as default };
