import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  redirect,
  typedjson, useTypedRouteLoaderData
} from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { getNoteData } from "./queries.server";
import { NoteIndexRoute } from "./notes-index-route";
import type { Params } from "@remix-run/react";
import { deleteNote, duplicateNote, updateNote } from "./actions.server";

const getParams = (params: Params) => {
  return parseParams(params, {
    noteId: z.string(),
    gameId: z.string(),
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { noteId, gameId } = getParams(params);
  const noteData = await getNoteData(api, noteId, gameId);

  if (noteData.note.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/notes`);
  }

  return typedjson(noteData);
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  const { noteId } = getParams(params);

  if (request.method === "POST") {
    return await duplicateNote(request, api, noteId, userId);
  }

  if (request.method === "PATCH") {
    return await updateNote(request, api, noteId);
  }

  if (request.method === "DELETE") {
    return await deleteNote(api, noteId);
  }

  return methodNotAllowed();
};

export { NoteIndexRoute as default };

export function useNoteData() {
  const data = useTypedRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.notes.$noteId._index",
  );
  if (data === undefined) {
    throw new Error(
      "useNoteData must be used within the _app.games.$gameId.notes.$noteId._index route or its children",
    );
  }
  return data;
}
