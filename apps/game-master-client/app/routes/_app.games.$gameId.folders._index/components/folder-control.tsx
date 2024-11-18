import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { Folder } from "@repo/api";
import { Button } from "~/components/ui/button";
import { EditFolderDialog } from "./edit-folder-dialog";

interface FolderControlsProps {
  folder: Folder;
  allFolders: Folder[];
}

export function FolderControls({ folder, allFolders }: FolderControlsProps) {
  const submit = useSubmit();
  return (
    <div className="flex justify-between items-center py-1 w-full text-sm">
      <span>{folder.name}</span>
      <div className="flex gap-1">
        <Button
          variant={"outline"}
          size={"icon"}
          onPress={() => submit({ folderId: folder.id }, { method: "DELETE" })}
        >
          <TrashIcon />
        </Button>
        <EditFolderDialog folder={folder} allFolders={allFolders} />
      </div>
    </div>
  );
}
