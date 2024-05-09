import { BookmarkIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ToggleButton } from "~/components/ui/toggle-button";
import { Toolbar } from "~/components/ui/toolbar";
import { Form, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Popover } from "~/components/ui/popover";
import { DialogTrigger } from "react-aria-components";
import { Dialog } from "~/components/ui/dialog";
import { ComboBox, ComboBoxItem } from "~/components/ui/combobox";
import { BasicEntity } from "@repo/db";

interface EditNoteToolbarProps {
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	noteId: string;
	folders: BasicEntity[];
}

export function EditNoteToolbar({
	isEditing,
	setIsEditing,
	noteId,
	folders,
}: EditNoteToolbarProps) {
	const fetcher = useFetcher();
	// remap entities from many-to-many structure
	return (
		<Toolbar aria-label="Edit note controls">
			<ToggleButton isSelected={isEditing} onChange={setIsEditing} size="icon">
				<Pencil1Icon />
			</ToggleButton>
			<Form method="DELETE" action={`/notes/${noteId}`}>
				<Button variant="ghost" size="icon" type="submit">
					<TrashIcon />
				</Button>
			</Form>
			<DialogTrigger>
				<Button variant="ghost" size="icon">
					<BookmarkIcon />
				</Button>
				<Popover>
					<Dialog>
						<fetcher.Form method="POST" className="flex gap-2 items-end">
							<ComboBox
								label="Select Folder"
								name="folder"
								allowsCustomValue
								items={folders}
							>
								{(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
							</ComboBox>
							<Button size="sm" type="submit">
								Move
							</Button>
						</fetcher.Form>
					</Dialog>
				</Popover>
			</DialogTrigger>
		</Toolbar>
	);
}
