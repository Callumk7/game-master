import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { NoteToolbar } from "./components/note-toolbar";
import { NoteSidebar } from "./components/note-sidebar";
import { OptionalEntitySchema } from "types/schemas";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });

  const note = await api.notes.getNote(noteId);
  const linkedNotes = await api.notes.getLinkedNotes(noteId);
  console.log(linkedNotes);
  return typedjson({ note, linkedNotes });
};

// Update note
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { noteId } = parseParams(params, {
    noteId: z.string(),
  });

  if (request.method === "PATCH") {
    const data = await parseForm(request, {
      content: z.string(),
      htmlContent: z.string(),
    });
    const result = await api.notes.updateNote(noteId, data);

    if (!result.success) {
      return new Response("Error");
    }

    return typedjson(result.data);
  }

  if (request.method === "PUT") {
    const data = await parseForm(request, {
      characterIds: OptionalEntitySchema,
      factionIds: OptionalEntitySchema
    })

    // TODO: error handling
    if (data.factionIds) {

      await api.notes.linkFactions(noteId, data.factionIds);
    } 
    // TODO: error handling
    if (data.characterIds) {
      await api.notes.linkCharacters(noteId, data.characterIds);
    } 

    return null
  }

  if (request.method === "DELETE") {
    const result = await api.notes.deleteNote(noteId);
    if (!result.success) {
      return new Response("Error");
    }
    return redirect("/");
  }

  return new Response("Method Not Allowed", { status: 400 });
};

export default function NotesRoute() {
  const { note, linkedNotes } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <div className="p-4 space-y-4">
        <NoteToolbar noteId={note.id} />
        <Text variant={"h2"}>{note.name}</Text>
        <Text variant={"p"}>{note.id}</Text>
        <EditorBody htmlContent={note.htmlContent} />
      </div>
      <NoteSidebar
        noteId={note.id}
        backlinks={linkedNotes.backLinks}
        outgoingLinks={linkedNotes.outgoingLinks}
      />
    </>
  );
}
