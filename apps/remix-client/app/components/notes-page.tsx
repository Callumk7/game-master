import { Header } from "./typeography";
import { useSort } from "~/hooks/sort";
import { Toolbar } from "./ui/toolbar";
import { EditorContent } from "@tiptap/react";
import { useSyncEditor } from "~/hooks/sync-editor";
import { Button } from "./ui/button";
import { useFetcher, useNavigate, useSubmit } from "@remix-run/react";
import { type EntityType, LINK_INTENT, type Note } from "@repo/db";
import { QuickNoteSlideOver } from "./quick-note-slideover";
import { RenderHtml } from "./render-html";
import { Link1Icon } from "@radix-ui/react-icons";
import { DialogTrigger, MenuTrigger, type Key } from "react-aria-components";
import { Menu, MenuItem } from "./ui/menu";
import { useAppData } from "~/routes/_app/route";

interface NotePageProps {
	entityId: string;
	entityType: EntityType;
	notes: Note[];
	action?: string;
	linkAction?: string;
}

export function NotePage({
	notes,
	entityId,
	entityType,
	action,
	linkAction,
}: NotePageProps) {
	const { allNotes } = useAppData();
	const sort = useSort(notes);
	const submit = useSubmit();
	let intent: LINK_INTENT;

	switch (entityType) {
		case "characters":
			intent = LINK_INTENT.CHARACTERS;
			break;
		case "factions":
			intent = LINK_INTENT.FACTIONS;
			break;
		case "plots":
			intent = LINK_INTENT.PLOTS;
			break;
		case "notes":
			intent = LINK_INTENT.NOTES;
			break;
		case "sessions":
			intent = LINK_INTENT.SESSIONS;
			break;
		case "locations":
			intent = LINK_INTENT.NOTES;
			break;
	}

	const handleAction = (k: Key) => {
		submit({ intent, noteId: k.toString() }, { method: "PUT", action: linkAction });
	};

	return (
		<div className="space-y-4">
			<Toolbar>
				<QuickNoteSlideOver action={action} />
				<MenuTrigger>
					<Button size="icon-sm" variant="secondary">
						<Link1Icon />
					</Button>
					<Menu onAction={handleAction} items={allNotes}>
						{(item) => <MenuItem>{item.name}</MenuItem>}
					</Menu>
				</MenuTrigger>
			</Toolbar>
			{notes.length > 0 && (
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
			)}
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
			<Header style="h2" colour="amber" tanker>
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
