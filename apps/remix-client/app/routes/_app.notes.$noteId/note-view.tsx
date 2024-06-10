import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { EditableText } from "~/components/editable-text";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { INTENT } from "@repo/db";
import { EditNoteToolbar } from "./components/toolbar";
import { LinksAside } from "~/components/links-aside";
import { Container, EntityHeader, EntityView, TwoColumnView } from "~/components/layout";
import { DialogTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	return (
		<EntityView top margin menu={<NoteMenu noteId={noteData.id} />}>
			{noteData.folder && (
				<p className="py-1 px-2 mb-4 text-xs rounded-full bg-primary-7 border border-primary-9 text-primary-12 w-fit">
					{noteData.folder.name}
				</p>
			)}
			<EntityHeader title={noteData.name}>
				<EditNoteToolbar
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					noteId={noteData.id}
					folders={folders}
				/>
			</EntityHeader>
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
	);
}

function NoteMenu({ noteId }: { noteId: string }) {
	return (
		<DialogTrigger>
			<Button>Menu</Button>
			<Menu>
				<MenuItem>Delete</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
