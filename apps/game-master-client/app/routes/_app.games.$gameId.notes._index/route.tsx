import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { Params } from "react-router";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { deleteNote, updateNote } from "~/actions/notes.server";
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

  const allGameNotes = await getData(() => api.games.notes(gameId));

  return typedjson({ allGameNotes, gameId });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const gameId = getParams(params);
  if (request.method === "POST") {
    return await createNoteAction(request);
  }
  if (request.method === "PATCH") {
    const { api } = await createApiFromReq(request);
    const { noteId } = await parseForm(request, { noteId: z.string() });
    return await updateNote(request, api, noteId);
  }
  if (request.method === "DELETE") {
    const { api } = await createApiFromReq(request);
    const { entityId } = await parseForm(request, { entityId: z.string() });
    return await deleteNote(api, entityId, gameId);
  }

  return methodNotAllowed();
};

export { NotesIndex as default };
