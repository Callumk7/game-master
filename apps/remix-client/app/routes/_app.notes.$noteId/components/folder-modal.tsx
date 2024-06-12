import { useFetcher } from "@remix-run/react";
import type { BasicEntity } from "@repo/db";
import { Button } from "~/components/ui/button";
import { ComboBox, ComboBoxItem } from "~/components/ui/combobox";
import { Dialog } from "~/components/ui/dialog";
import { Modal } from "~/components/ui/modal";

interface FolderModalProps {
	folders: BasicEntity[];
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function FolderModal({ folders, isOpen, setIsOpen }: FolderModalProps) {
	const fetcher = useFetcher();
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} isDismissable>
			<Dialog>
				{({ close }) => (
					<fetcher.Form method="POST" className="flex gap-2 items-end" onSubmit={close}>
						<ComboBox
							label="Select Folder"
							name="folderName"
							allowsCustomValue
							items={folders}
						>
							{(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
						</ComboBox>
						<Button size="sm" type="submit">
							Move
						</Button>
					</fetcher.Form>
				)}
			</Dialog>
		</Modal>
	);
}
