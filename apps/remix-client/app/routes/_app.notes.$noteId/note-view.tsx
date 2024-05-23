import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { EditableText } from "~/components/editable-text";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { INTENT } from "@repo/db";
import { EditNoteToolbar } from "./components/toolbar";
import { LinksAside } from "./components/links-aside";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	return (
		<div className="grid grid-cols-5">
			<div className="col-span-4">
				{noteData.folder && (
					<p className="py-1 px-2 mb-4 text-xs rounded-full bg-primary-7 text-primary-12 w-fit">
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
			<LinksAside
				characters={noteData.characters.map((c) => c.character)}
				factions={noteData.factions.map((f) => f.faction)}
				sessions={noteData.sessions.map((s) => s.session)}
			/>
		</div>
	);
}
