import { Form } from "@remix-run/react";
import type { Folder } from "@repo/api";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { JollySelect, SelectItem } from "~/components/ui/select";
import { JollyTextField } from "~/components/ui/textfield";

interface EditFolderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  folder: Folder;
  allFolders: Folder[];
}

export function EditFolderDialog({
  isOpen,
  setIsOpen,
  folder,
  allFolders,
}: EditFolderDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>
        <Form method="PATCH">
          <div className="space-y-4">
            <JollyTextField label="Name" name="name" defaultValue={folder.name} />
            <JollySelect items={allFolders} label="Parent Folder" name="parentFolderId">
              {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
            </JollySelect>
            <DialogFooter>
              <Button name="folderId" value={folder.id} type="submit">
                Submit
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
}
