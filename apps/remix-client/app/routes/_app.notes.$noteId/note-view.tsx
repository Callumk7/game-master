import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { EditableText } from "~/components/editable-text";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { INTENT } from "@repo/db";
import { EditNoteToolbar } from "./components/toolbar";
import { LinksAside } from "~/components/links-aside";
import { Container, TwoColumnView } from "~/components/layout";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	// BUG:
	// TODO: This should probably be an entityView? Not sure why it isn't

	return (
		<Container width="wide">
			{noteData.folder && (
				<p className="py-1 px-2 mb-4 text-xs rounded-full bg-primary-7 text-primary-12 w-fit">
					{noteData.folder.name}
				</p>
			)}
			<EditableText
				fieldName={"name"}
				value={noteData.name}
				inputClassName={
					"text-5xl font-bold mb-5 font-tanker w-full focus:outline-none bg-inherit text-grade-12"
				}
				inputLabel={"note name input"}
				buttonClassName={"text-5xl font-bold font-tanker w-full mb-5 text-left"}
				buttonLabel={"note name button"}
				method="patch"
			>
				<input type="hidden" name="intent" value={INTENT.UPDATE_NAME} />
			</EditableText>
			<div className="mb-5">
				<EditNoteToolbar
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					noteId={noteData.id}
					folders={folders}
				/>
			</div>
			<TwoColumnView
				aside={
					<LinksAside
						characters={noteData.characters.map((c) => c.character)}
						factions={noteData.factions.map((f) => f.faction)}
						sessions={noteData.sessions.map((s) => s.session)}
					/>
				}
			>
				<EditorPreview
					isEditing={isEditing}
					editor={editor}
					htmlContent={optimisticContent}
				/>
			</TwoColumnView>
		</Container>
	);
}
