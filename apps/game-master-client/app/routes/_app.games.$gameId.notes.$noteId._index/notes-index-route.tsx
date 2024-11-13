import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { useNoteData } from "../_app.games.$gameId.notes.$noteId/route";
import { Layout } from "~/components/layout";
import { LinkNotesPopover } from "~/components/linking/link-notes";
import { LinkedNotesAside, LinksAside } from "~/components/linking/linked-notes-sidebar";
import { CoverImage } from "~/components/cover-image";

export function NoteIndexRoute() {
  const { note, folders, linkedNotes } = useNoteData();
  const { notes } = useGameData();
  const { suggestionItems } = useGameData();

  return (
    <Layout width={"full"}>
      <div className="grid grid-cols-5 gap-4">
        <LinksAside>
          <LinkNotesPopover allNotes={notes} entityNotes={linkedNotes.outgoingLinks} />
          <LinkedNotesAside linkedNotes={linkedNotes.outgoingLinks} />
        </LinksAside>
        <div className="col-span-4">
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
        </div>
      </div>
    </Layout>
  );
}
