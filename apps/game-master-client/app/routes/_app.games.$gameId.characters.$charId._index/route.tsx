import type { ActionFunctionArgs } from "@remix-run/node";
import { updateCharacterSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed } from "~/util/responses";
import { useCharacterData } from "../_app.games.$gameId.characters.$charId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { NoteCard } from "./components/note-card";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { charId } = parseParams(params, { charId: z.string() });
  if (request.method === "PATCH") {
    const data = await parseForm(request, updateCharacterSchema);
    const result = await api.characters.updateCharacterDetails(charId, data);
    return typedjson(result);
  }

  if (request.method === "POST") {
    const { noteId } = await parseForm(request, { noteId: z.string() });
    const result = await api.characters.linkNotes(charId, [noteId]);
    return typedjson(result);
  }

  return methodNotAllowed();
};

export default function CharacterRoute() {
  const { characterDetails, charNotes } = useCharacterData();
  const { suggestionItems, notes } = useGameData();
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-3">
          <Pill size={"xs"} variant={"secondary"}>
            {`permission level: ${characterDetails.userPermissionLevel}`}
          </Pill>
          <EditableText
            method="patch"
            fieldName={"name"}
            value={characterDetails.name}
            variant={"h1"}
            weight={"semi"}
            inputLabel={"Game name input"}
            buttonLabel={"Edit game name"}
          />
          {characterDetails.userPermissionLevel === "view" ? (
            <>
              <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px] ">
                You have permission to view
              </span>
              <EditorPreview htmlContent={characterDetails.htmlContent ?? ""} />
            </>
          ) : (
            <EditorClient
              htmlContent={characterDetails.htmlContent ?? ""}
              suggestionItems={suggestionItems}
            />
          )}
        </div>
        <NoteCard notes={charNotes} />
      </div>
    </div>
  );
}
