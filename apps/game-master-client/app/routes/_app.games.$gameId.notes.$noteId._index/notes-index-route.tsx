import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText, Text } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { useNoteData } from "../_app.games.$gameId.notes.$noteId/route";
import { Layout } from "~/components/layout";

export function NoteIndexRoute() {
  const { note, folders } = useNoteData();
  const { suggestionItems } = useGameData();

  return (
    <Layout>
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
    </Layout>
  );
}
