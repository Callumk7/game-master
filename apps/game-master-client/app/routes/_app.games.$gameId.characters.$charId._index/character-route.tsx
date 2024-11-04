import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useCharacterData } from "../_app.games.$gameId.characters.$charId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { NoteCard } from "./components/note-card";

export default function CharacterRoute() {
  const { characterDetails, charNotes } = useCharacterData();
  const { suggestionItems, notes } = useGameData();
  return (
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
  );
}
