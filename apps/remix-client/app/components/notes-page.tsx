import { Header } from "./typeography";
import { useSortTable } from "~/hooks/sort-table";
import { Select, SelectItem } from "./ui/select";
import { Toolbar } from "./ui/toolbar";
import { EditorContent } from "@tiptap/react";
import { useSyncEditor } from "~/hooks/sync-editor";
import { Button } from "./ui/button";
import { useFetcher, useNavigate } from "@remix-run/react";
import { EntityType, LINK_INTENT, Note } from "@repo/db";
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
	const sort = useSortTable(notes);
	return (
		<div>
			<Toolbar className="mb-5">
				<Select
					onSelectionChange={(k) =>
						sort.handleSortChange({ column: k, direction: "descending" })
					}
				>
					<SelectItem id={"name"}>Name</SelectItem>
					<SelectItem id={"createdAt"}>Created At</SelectItem>
				</Select>
				<QuickNoteSlideOver action={action ?? "/notes/new"} />
			</Toolbar>
			<div className="border border-grade-6 rounded-lg p-4">
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
		<div className="flex flex-col gap-3 hover:bg-grade-1 py-2 px-4 rounded-lg">
			<NoteBlockToolbar
				entityId={entityId}
				entityType={entityType}
				noteId={note.id}
				isEditing={isEditing}
				setIsEditing={setIsEditing}
			/>
			<span className="text-sm font-light italic text-grade-9">
				{note.createdAt.toLocaleString("gmt")}
			</span>
			<Header style="h3">{note.name}</Header>
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
