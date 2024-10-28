import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorClient, EditorPreview } from "~/components/editor";
import { EntityToolbar } from "~/components/entity-toolbar";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { getNoteData } from "./queries.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { duplicateNoteSchema, updateNoteContentSchema } from "@repo/api";
import { stringOrArrayToArray } from "callum-util";
import { OptionalEntitySchema } from "types/schemas";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { createApi } from "~/lib/api.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { noteId, gameId } = parseParams(params, {
    noteId: z.string(),
    gameId: z.string(),
  });

  const userId = await validateUser(request);
  const api = createApi(userId);
  const { note, linkedNotes, linkedChars, linkedFactions } = await getNoteData(
    api,
    noteId,
  );

  if (note.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/notes`);
  }

  const folders = await api.folders.getGameFolders(note.gameId);

  return typedjson({ note, linkedNotes, linkedChars, linkedFactions, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
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

export default function NoteIndexRoute() {
  const { note, folders } = useTypedLoaderData<typeof loader>();
  const { suggestionItems } = useGameData();

  return (
    <>
      <div className="p-4 space-y-4">
        <EntityToolbar
          gameId={note.gameId}
          entityOwnerId={note.ownerId}
          entityVisibility={note.visibility}
          permissions={note.permissions}
          userPermissionLevel={note.userPermissionLevel!}
          folders={folders}
        />
        <EditableText
          method="patch"
          fieldName={"name"}
          value={note.name}
          variant={"h2"}
          weight={"semi"}
          inputLabel={"Game name input"}
          buttonLabel={"Edit game name"}
          action={`/games/${note.gameId}/notes/${note.id}`}
        />
        {note.userPermissionLevel === "view" ? (
          <>
            <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px] ">
              You have permission to view
            </span>
            <EditorPreview htmlContent={note.htmlContent ?? ""} />
          </>
        ) : (
          <EditorClient
            htmlContent={note.htmlContent ?? ""}
            suggestionItems={suggestionItems}
          />
        )}
      </div>
    </>
  );
}

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
