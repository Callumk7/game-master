import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { JollyMenu, MenuItem } from "~/components/ui/menu";
import { JollyTextField } from "~/components/ui/textfield";
import { Toolbar } from "~/components/ui/toolbar";

interface FolderControlsProps {
  folderId: string;
}

export function FolderControls({ folderId }: FolderControlsProps) {
  const submit = useSubmit();
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] = useState(false);
  return (
    <>
      <Toolbar>
        <JollyMenu label="Menu" variant={"outline"}>
          <MenuItem onAction={() => setIsRenameFolderDialogOpen(true)}>Rename</MenuItem>
          <MenuItem onAction={() => submit({ folderId }, { method: "delete" })}>
            Delete
          </MenuItem>
        </JollyMenu>
      </Toolbar>
      <RenameFolderDialog
        isOpen={isRenameFolderDialogOpen}
        setIsOpen={setIsRenameFolderDialogOpen}
      />
    </>
  );
}

interface RenameFolderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
function RenameFolderDialog({ isOpen, setIsOpen }: RenameFolderDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <Form method="patch">
          <JollyTextField label="Folder name" name="name" />
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
}
