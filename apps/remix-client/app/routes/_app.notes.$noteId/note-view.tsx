import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./route";
import { EditableText } from "~/components/editable-text";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { INTENT } from "@repo/db";
import { EditNoteToolbar } from "./components/toolbar";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	return (
		<div>
			{noteData.folder && (
				<p className="mb-4 text-xs bg-primary-7 text-primary-12 px-2 py-1 rounded-full w-fit">
					{noteData.folder.name}
				</p>
			)}
			<EditableText
				fieldName={"name"}
				value={noteData.name}
				inputClassName={
					"text-3xl font-bold mb-5 focus:outline-none bg-inherit text-grade-12"
				}
				inputLabel={"note name input"}
				buttonClassName={"text-3xl font-bold mb-5"}
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
			<EditorPreview
				isEditing={isEditing}
				editor={editor}
				htmlContent={noteData.htmlContent}
			/>
		</div>
	);
}
