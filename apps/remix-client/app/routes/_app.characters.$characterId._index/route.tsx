import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { EditorPreview } from "~/components/editor-preview";
import { ToggleButton } from "~/components/ui/toggle-button";
import { useSyncEditor } from "~/hooks/sync-editor";

export default function CharacterIndex() {
	const { characterData } = useCharacterRouteData();
	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: characterData.bio,
		action: `/characters/${characterData.id}`,
	});
	return (
		<>
			<ToggleButton isSelected={isEditing} onPress={() => setIsEditing(!isEditing)}>
				Edit
			</ToggleButton>
			<EditorPreview
				editor={editor}
				isEditing={isEditing}
				htmlContent={characterData.bio}
			/>
		</>
	);
}
