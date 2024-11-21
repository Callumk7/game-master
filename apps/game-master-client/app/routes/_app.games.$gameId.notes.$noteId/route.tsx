import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, type Params } from "@remix-run/react";
import { useState } from "react";
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { EntityToolbar } from "~/components/entity-toolbar";
import { ScrollFade } from "~/components/scroll-visibility";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { updateNote } from "../_app.games.$gameId.notes.$noteId._index/actions.server";
import { deleteNote, duplicateNote } from "./actions.server";
import { NoteNavigation } from "./components/navigation";
import { getNoteData } from "./queries.server";

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
  if (request.method === "PATCH") {
    return await updateNote(request, api, noteId);
  }

  if (request.method === "POST") {
    return await duplicateNote(request, api, noteId, userId);
  }

  if (request.method === "DELETE") {
    return await deleteNote(api, noteId);
  }

  return methodNotAllowed();
};
export default function NotesRoute() {
  const { note, folders } = useTypedLoaderData<typeof loader>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <div className="flex sticky z-20 justify-between items-center w-full top-[86px]">
        <ScrollFade>
          <NoteNavigation noteId={note.id} gameId={note.gameId} />
        </ScrollFade>
        <EntityToolbar
          gameId={note.gameId}
          entityOwnerId={note.ownerId}
          entityVisibility={note.visibility}
          permissions={note.permissions}
          userPermissionLevel={note.userPermissionLevel!}
          folders={folders}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      </div>
      <Outlet />
    </>
  );
}

export function useNoteData() {
  const data = useTypedRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.notes.$noteId",
  );
  if (data === undefined) {
    throw new Error(
      "useNoteData must be used within the _app.games.$gameId.notes.$noteId route or its children",
    );
  }
  return data;
}
