import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useCharacterData } from "../_app.games.$gameId.characters.$charId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { Layout, MainGrid, SideGrid } from "~/components/layout";
import { LinkedNotesAside, LinksAside } from "~/components/linking/linked-notes-sidebar";
import { LinkNotesPopover } from "~/components/linking/link-notes";

export function CharacterOverview() {
  const { characterDetails, charNotes } = useCharacterData();
  const { suggestionItems, notes } = useGameData();
  return (
    <Layout width={"full"}>
      <div className="grid grid-cols-5 gap-4">
        <LinksAside>
          <LinkNotesPopover allNotes={notes} entityNotes={charNotes} />
          <LinkedNotesAside linkedNotes={charNotes} />
        </LinksAside>
        <div className="col-span-4">
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
              <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px]">
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
      </div>
    </Layout>
  );
}
