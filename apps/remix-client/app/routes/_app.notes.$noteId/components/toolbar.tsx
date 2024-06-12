import {
	BookmarkIcon,
	Pencil1Icon,
	PlusCircledIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { ToggleButton } from "~/components/ui/toggle-button";
import { Toolbar } from "~/components/ui/toolbar";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { z } from "zod";

// NOTE:: This component is no longer being used, and has been replaced
// by the NoteMenu component, but it remains for reference for a few more
// days before being removed.

interface EditNoteToolbarProps {
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
	isFolderModalOpen: boolean;
	setIsFolderModalOpen: (isFolderModalOpen: boolean) => void;
	noteId: string;
}
export function EditNoteToolbar({
	isEditing,
	setIsEditing,
	isSidebarOpen,
	setIsSidebarOpen,
	isFolderModalOpen,
	setIsFolderModalOpen,
	noteId,
}: EditNoteToolbarProps) {
	// remap entities from many-to-many structure
	return (
		<Toolbar aria-label="Edit note controls">
			<ToggleButton isSelected={isEditing} onChange={setIsEditing} size="icon">
				<Pencil1Icon />
			</ToggleButton>
			<Button
				variant="ghost"
				size="icon"
				onPress={() => setIsFolderModalOpen(!isFolderModalOpen)}
			>
				<BookmarkIcon />
			</Button>
			<Button
				size="icon"
				variant="ghost"
				onPress={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				<PlusCircledIcon />
			</Button>
			<DeleteNoteButton noteId={noteId} />
		</Toolbar>
	);
}

export const DeleteNoteSchema = z.object({
	intent: z.literal("DELETE_NOTE"),
});

function DeleteNoteButton({ noteId }: { noteId: string }) {
	return (
		<Form method="DELETE" action={`/notes/${noteId}`}>
			<Button
				variant="ghost"
				size="icon"
				type="submit"
				className={"hover:text-destructive-10"}
				name="intent"
				value="DELETE_NOTE"
			>
				<TrashIcon />
			</Button>
		</Form>
	);
}
