import { useTypedLoaderData } from "remix-typedjson";
import { EditorClient, EditorPreview } from "~/components/editor";
import { EntityToolbar } from "~/components/entity-toolbar";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import type { loader } from "./route";

export function NoteIndexRoute() {
  const { note, folders } = useTypedLoaderData<typeof loader>();
  const { suggestionItems } = useGameData();

  return (
    <>
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
          variant={"h1"}
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
    </>
  );
}
