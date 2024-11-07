import type { Character } from "@repo/api";
import { EditCharacterForm } from "~/components/forms/character-forms";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";

interface EditCharacterDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  character: Character;
}
export function EditCharacterDialog({
  isOpen,
  setIsOpen,
  character,
}: EditCharacterDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Edit Character</DialogTitle>
            </DialogHeader>
            <EditCharacterForm character={character} close={close} />
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}
