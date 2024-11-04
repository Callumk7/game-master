import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { useGameData } from "../_app.games.$gameId/route";

export function FactionIndex() {
  const { factionDetails } = useFactionData();
  const { suggestionItems } = useGameData();
  return (
    <>
      <div>
        <Pill size={"xs"} variant={"secondary"}>
          {`permission level: ${factionDetails.userPermissionLevel}`}
        </Pill>
        <EditableText
          method="patch"
          fieldName={"name"}
          value={factionDetails.name}
          variant={"h2"}
          weight={"semi"}
          inputLabel={"Game name input"}
          buttonLabel={"Edit game name"}
        />
      </div>
      {factionDetails.userPermissionLevel === "view" ? (
        <EditorPreview htmlContent={factionDetails.htmlContent ?? ""} />
      ) : (
        <EditorClient
          htmlContent={factionDetails.htmlContent ?? ""}
          suggestionItems={suggestionItems}
        />
      )}
    </>
  );
}
