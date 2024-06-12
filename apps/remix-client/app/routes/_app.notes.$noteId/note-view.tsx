import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { LinksAside } from "~/components/links-aside";
import { EntityHeader, EntityView, TwoColumnView } from "~/components/layout";
import { FolderPill } from "./components/folder-pill";
import { NoteMenu } from "./components/note-menu";
import { useState } from "react";
import { NoteLinksSlideOver } from "./components/links-slideover";
import { FolderModal } from "./components/folder-modal";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

	return (
		<>
			<EntityView
				top
				margin
				menu={
					<NoteMenu
						noteId={noteData.id}
						setIsEditing={setIsEditing}
						isEditing={isEditing}
						isSidebarOpen={isSidebarOpen}
						isFolderModalOpen={isFolderModalOpen}
						setIsFolderModalOpen={setIsFolderModalOpen}
						setIsSidebarOpen={setIsSidebarOpen}
						folders={folders}
					/>
				}
			>
				{noteData.folder && (
					<FolderPill folderName={noteData.folder.name} folderId={noteData.folderId} />
				)}
				<EntityHeader title={noteData.name} />
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
			</EntityView>
			<NoteLinksSlideOver
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<FolderModal
				isOpen={isFolderModalOpen}
				setIsOpen={setIsFolderModalOpen}
				folders={folders}
			/>
		</>
	);
}
