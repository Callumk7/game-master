import { Header } from "./typeography";
import { useSort } from "~/hooks/sort";
import { Toolbar } from "./ui/toolbar";
import { EditorContent } from "@tiptap/react";
import { useSyncEditor } from "~/hooks/sync-editor";
import { Button } from "./ui/button";
import { useFetcher, useNavigate } from "@remix-run/react";
import { type EntityType, LINK_INTENT, type Note } from "@repo/db";
import { QuickNoteSlideOver } from "./quick-note-slideover";
import { RenderHtml } from "./render-html";

interface NotePageProps {
	entityId: string;
	entityType: EntityType;
	notes: Note[];
	action?: string;
}

export function NotePage({ notes, entityId, entityType, action }: NotePageProps) {
	// TODO: Should make this sort hook more generic for use in all collections
	const sort = useSort(notes);
	return (
		<div className="space-y-4">
			<QuickNoteSlideOver action={action} />
			<div className="p-4 rounded-lg border border-grade-6">
				{sort.sortedItems.map((note) => (
					<NoteBlock
						key={note.id}
						note={note}
						entityId={entityId}
						entityType={entityType}
					/>
				))}
			</div>
		</div>
	);
}

interface NoteBlockProps {
	entityId: string;
	entityType: EntityType;
	note: Note;
}

export function NoteBlock({ note, entityId, entityType }: NoteBlockProps) {
	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: note.htmlContent,
		action: `/notes/${note.id}`,
	});
	return (
		<div className="flex flex-col gap-3 py-2 px-4 rounded-lg hover:bg-grade-1">
			<NoteBlockToolbar
				entityId={entityId}
				entityType={entityType}
				noteId={note.id}
				isEditing={isEditing}
				setIsEditing={setIsEditing}
			/>
			<span className="text-sm italic font-light text-grade-9">
				{note.createdAt.toLocaleString("gmt")}
			</span>
			<Header style="h3" colour="amber">
				{note.name}
			</Header>
			{isEditing ? (
				<EditorContent editor={editor} />
			) : (
				<RenderHtml content={optimisticContent} />
			)}
		</div>
	);
}

interface NoteBlockToolbarProps {
	entityId: string;
	entityType: EntityType;
	noteId: string;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}
function NoteBlockToolbar({
	noteId,
	entityType,
	isEditing,
	setIsEditing,
	entityId,
}: NoteBlockToolbarProps) {
	const fetcher = useFetcher();
	const navigate = useNavigate();
	return (
		<Toolbar>
			<Button
				variant={isEditing ? "secondary" : "outline"}
				className={"w-fit"}
				size="sm"
				onPress={() => setIsEditing(!isEditing)}
			>
				{isEditing ? "Save" : "Edit"}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => {
					fetcher.submit(
						{ entity_id: noteId, intent: LINK_INTENT.NOTES },
						{ method: "DELETE", action: `/${entityType}/${entityId}/links` },
					);
				}}
			>
				Unlink
			</Button>
			<Button variant="outline" size="sm" onPress={() => navigate(`/notes/${noteId}`)}>
				Open
			</Button>
			<Button variant="hover-destructive" size="sm">
				Delete
			</Button>
		</Toolbar>
	);
}
