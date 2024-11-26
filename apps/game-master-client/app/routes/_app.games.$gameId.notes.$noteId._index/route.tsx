import type { ActionFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { NoteIndexRoute } from "./notes-index-route";
import { updateNote } from "~/actions/notes.server";

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
