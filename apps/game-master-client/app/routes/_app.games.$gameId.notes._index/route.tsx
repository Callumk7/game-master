import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { createNoteAction } from "~/queries/server/create-note.server";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
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
  if (request.method === "DELETE") {
    const { api } = await createApiFromReq(request);
    const { entityId } = await parseForm(request, { entityId: z.string() });
    const result = await api.notes.deleteNote(entityId);
    return typedjson(result);
  }

  return methodNotAllowed();
};

export { NotesIndex as default };
