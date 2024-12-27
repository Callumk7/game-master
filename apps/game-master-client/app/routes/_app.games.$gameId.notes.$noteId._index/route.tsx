import type { ActionFunctionArgs } from "react-router";
import type { Params } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";
import { updateNote } from "~/actions/notes.server";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { NoteIndexRoute } from "./notes-index-route";

const getParams = (params: Params) => {
  return parseParams(params, {
    noteId: z.string(),
    gameId: z.string(),
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { noteId } = getParams(params);

  if (request.method === "PATCH") {
    return await updateNote(request, api, noteId);
  }

  return methodNotAllowed();
};

export { NoteIndexRoute as default };
