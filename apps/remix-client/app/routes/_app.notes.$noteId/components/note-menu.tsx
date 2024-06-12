import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { BasicEntity } from "@repo/db";
import { MenuTrigger, SubmenuTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";

interface NoteMenuProps {
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
	isFolderModalOpen: boolean;
	setIsFolderModalOpen: (isFolderModalOpen: boolean) => void;
	noteId: string;
	folders: BasicEntity[];
}
export function NoteMenu({
	noteId,
	isEditing,
	setIsEditing,
	isSidebarOpen,
	isFolderModalOpen,
	setIsFolderModalOpen,
	setIsSidebarOpen,
	folders,
}: NoteMenuProps) {
	const submit = useSubmit();
	return (
		<MenuTrigger>
			<Button>Menu</Button>
			<Menu>
				<MenuItem onAction={() => setIsEditing(!isEditing)}>
					{isEditing ? "Save" : "Edit"}
				</MenuItem>
				<SubmenuTrigger>
					<MenuItem>
						<div className="w-full flex items-center justify-between">
							<span>Move to Folder</span>
							<ArrowRightIcon />
						</div>
					</MenuItem>
					<Menu items={folders}>
						{(item) => (
							<MenuItem
								onAction={() => submit({ folderName: item.name }, { method: "POST" })}
							>
								{item.name}
							</MenuItem>
						)}
					</Menu>
				</SubmenuTrigger>
				<MenuItem onAction={() => setIsFolderModalOpen(!isFolderModalOpen)}>
					Create New Folder
				</MenuItem>
				<MenuItem onAction={() => setIsSidebarOpen(!isSidebarOpen)}>
					Link to Entities
				</MenuItem>
			</Menu>
		</MenuTrigger>
	);
}
