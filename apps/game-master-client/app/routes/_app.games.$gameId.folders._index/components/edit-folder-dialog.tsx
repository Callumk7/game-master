import { GearIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import type { Folder } from "@repo/api";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { JollySelect, SelectItem } from "~/components/ui/select";
import { JollyTextField } from "~/components/ui/textfield";

interface EditFolderDialogProps {
  folder: Folder;
  allFolders: Folder[];
}

export function EditFolderDialog({ folder, allFolders }: EditFolderDialogProps) {
  return (
    <DialogTrigger>
      <Button variant={"outline"} size={"icon"}>
        <GearIcon />
      </Button>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <Form method="PATCH">
            <JollyTextField label="Name" name="name" defaultValue={folder.name} />
            <JollySelect items={allFolders} label="Parent Folder" name="parentFolderId">
              {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
            </JollySelect>
            <DialogFooter>
              <Button name="folderId" value={folder.id} type="submit">
                Submit
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
