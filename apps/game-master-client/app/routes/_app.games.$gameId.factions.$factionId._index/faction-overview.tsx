import { EditorClient, EditorPreview } from "~/components/editor";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { Layout } from "~/components/layout";

export function FactionOverview() {
  const { factionDetails } = useFactionData();
  const { suggestionItems } = useGameData();
  return (
    <Layout>
      <div>
        <Pill size={"xs"} variant={"secondary"}>
          {`permission level: ${factionDetails.userPermissionLevel}`}
        </Pill>
        <EditableText
          method="patch"
          fieldName={"name"}
          value={factionDetails.name}
          variant={"h1"}
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
    </Layout>
  );
}
