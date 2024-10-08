import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { EntityToolbar } from "~/components/entity-toolbar";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { getNoteData } from "./queries.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });

  const { note, linkedNotes, linkedChars, linkedFactions } = await getNoteData(noteId);

  return typedjson({ note, linkedNotes, linkedChars, linkedFactions });
};

let isInitialRequest = true;

export const clientLoader = async ({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });
  if (isInitialRequest) {
    isInitialRequest = false;
    const serverData = await serverLoader();
    localStorage.setItem(noteId, JSON.stringify(serverData));
    return serverData;
  }

  const cachedData = localStorage.getItem(noteId);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const serverData = await serverLoader();
  localStorage.setItem(noteId, JSON.stringify(serverData));
  return serverData;
};

clientLoader.hydrate = true;

export default function NoteIndexRoute() {
  const { note } = useTypedLoaderData<typeof loader>();

  const { suggestionItems } = useGameData();

  return (
    <>
      <div className="p-4 space-y-4">
        <EntityToolbar />
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
        <span className="rounded-full px-2.5 py-0.5 bg-accent text-accent-foreground text-xs font-semibold ml-1">
          {note.type}
        </span>
        <EditorBody
          htmlContent={note.htmlContent ?? ""}
          suggestionItems={suggestionItems}
          action={`/games/${note.gameId}/notes/${note.id}`}
        />
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
