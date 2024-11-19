import { CoverImage } from "~/components/cover-image";
import { EditorClient, EditorPreview } from "~/components/editor";
import { Layout } from "~/components/layout";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useNoteData } from "../_app.games.$gameId.notes.$noteId/route";
import { useGameData } from "../_app.games.$gameId/route";

export function NoteIndexRoute() {
  const { note } = useNoteData();
  const { suggestionItems } = useGameData();

  return (
    <Layout>
      {note.coverImageUrl && <CoverImage src={note.coverImageUrl} ratio="16/9" />}
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
