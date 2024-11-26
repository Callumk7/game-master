import type { Note } from "@repo/api";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { BaseNoteForm } from "./note-forms";

interface EditNoteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  note: Note;
}
export function EditNoteDialog({ isOpen, setIsOpen, note }: EditNoteDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <BaseNoteForm method="PATCH" handleSubmit={close} note={note}>
              <input type="hidden" name="noteId" value={note.id} />
            </BaseNoteForm>
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}
