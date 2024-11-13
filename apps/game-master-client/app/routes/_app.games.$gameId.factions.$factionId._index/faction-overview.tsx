import { CoverImage } from "~/components/cover-image";
import { EditorClient, EditorPreview } from "~/components/editor";
import { Layout } from "~/components/layout";
import { Pill } from "~/components/pill";
import { EditableText } from "~/components/ui/typeography";
import { useImageUpload } from "~/hooks/image-uploader";
import { useFactionData } from "../_app.games.$gameId.factions.$factionId/route";
import { useGameData } from "../_app.games.$gameId/route";

export function FactionOverview() {
  const { factionDetails } = useFactionData();
  const { suggestionItems } = useGameData();

  const fetcher = useImageUpload({
    ownerId: factionDetails.ownerId,
    entityId: factionDetails.id,
    entityType: "factions",
  });

  return (
    <Layout>
      <div>
        {factionDetails.coverImageUrl && (
          <CoverImage src={factionDetails.coverImageUrl} ratio="16/9" />
        )}
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
          fetcher={fetcher}
        />
      )}
    </Layout>
  );
}
