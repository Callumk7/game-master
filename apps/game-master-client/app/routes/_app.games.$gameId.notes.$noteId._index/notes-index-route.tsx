import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { useGameData } from "../_app.games.$gameId/route";
import { EntityToolbar } from "~/components/entity-toolbar";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { EditorClient, EditorPreview } from "~/components/editor";

export function NoteIndexRoute() {
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
        <div>
          <Pill
            size={"xs"}
            variant={"secondary"}
          >{`permission level: ${note.userPermissionLevel}`}</Pill>
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
        </div>
        {note.userPermissionLevel === "view" ? (
          <EditorPreview htmlContent={note.htmlContent ?? ""} />
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
