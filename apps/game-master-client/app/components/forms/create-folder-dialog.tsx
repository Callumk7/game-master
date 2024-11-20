import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateFolderForm } from "./create-folder-form";
import type { BasicEntity } from "@repo/api";

interface CreateFolderSlideoverProps {
  gameId: string;
  folders?: BasicEntity[];
}

export function CreateFolderSlideover({ gameId, folders }: CreateFolderSlideoverProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Create Folder</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="overflow-y-auto max-h-[95vh]">
              <div className="space-y-6 p-[1px]">
                <DialogHeader>
                  <DialogTitle>Create Character</DialogTitle>
                </DialogHeader>
                <CreateFolderForm close={close} gameId={gameId} folders={folders} />
              </div>
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
