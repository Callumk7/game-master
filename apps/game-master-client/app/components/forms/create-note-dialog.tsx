import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateNoteForm } from "./note-forms";

interface CreateNoteProps {
  gameId: string;
}

export function CreateNoteSlideover({ gameId }: CreateNoteProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Add Note</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="overflow-y-auto max-h-[95vh]">
              <DialogHeader>
                <DialogTitle>New Note</DialogTitle>
              </DialogHeader>
              <div className="my-4">
                <CreateNoteForm gameId={gameId} close={close} />
              </div>
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
