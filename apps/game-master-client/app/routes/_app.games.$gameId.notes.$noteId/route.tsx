import type { ActionFunctionArgs } from "@remix-run/node";
import {
    Outlet,
  type ClientActionFunctionArgs,
} from "@remix-run/react";
import { duplicateNoteSchema, updateNoteContentSchema } from "@repo/api";
import { stringOrArrayToArray } from "callum-util";
import {
  redirect,
  typedjson,
} from "remix-typedjson";
import { OptionalEntitySchema } from "types/schemas";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";

// Update note
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });

  if (request.method === "POST") {
    const data = await parseForm(request, duplicateNoteSchema.omit({ ownerId: true }));

    const duplicatedNote = await api.notes.duplicateNote(noteId, {
      ...data,
      ownerId: userId,
    });

    if (!duplicatedNote.success) {
      return unsuccessfulResponse(duplicatedNote.message);
    }

    return redirect(
      `/games/${duplicatedNote.data.gameId}/notes/${duplicatedNote.data.id}`,
    );
  }

  if (request.method === "PATCH") {
    const data = await parseForm(request, updateNoteContentSchema);
    const result = await api.notes.updateNote(noteId, data);

    if (!result.success) {
      return unsuccessfulResponse(result.message);
    }

    return typedjson(result.data);
  }

  if (request.method === "PUT") {
    const data = await parseForm(request, {
      characterIds: OptionalEntitySchema,
      factionIds: OptionalEntitySchema,
    });

    if (data.factionIds) {
      await api.notes.updateLinkedFactions(noteId, stringOrArrayToArray(data.factionIds));
    }
    if (data.characterIds) {
      await api.notes.updateLinkedCharacters(
        noteId,
        stringOrArrayToArray(data.characterIds),
      );
    }

    return null;
  }

  if (request.method === "DELETE") {
    const result = await api.notes.deleteNote(noteId);
    if (!result.success) {
      return new Response("Error");
    }
    return redirect("/");
  }

  return methodNotAllowed();
};

export async function clientAction({ params, serverAction }: ClientActionFunctionArgs) {
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });

  localStorage.removeItem(noteId);

  const serverData = await serverAction();
  return serverData;
}

export default function NotesRoute() {
  return <Outlet />
}

