import type { Faction } from "@repo/api";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { EditFactionForm } from "./faction-forms";

interface EditFactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  faction: Faction;
}
export function EditFactionDialog({
  isOpen,
  setIsOpen,
  faction,
}: EditFactionDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Edit Faction</DialogTitle>
            </DialogHeader>
            <EditFactionForm faction={faction} close={close} />
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}
