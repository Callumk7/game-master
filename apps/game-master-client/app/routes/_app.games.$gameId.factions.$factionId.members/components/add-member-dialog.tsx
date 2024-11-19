import type { Character } from "@repo/api";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogOverlay, DialogTrigger } from "~/components/ui/dialog";

interface AddMemberDialogProps {
  allCharacters: Character[];
}

export function AddMemberDialog({ allCharacters }: AddMemberDialogProps) {
  return (
    <DialogTrigger>
      <Button>Add</Button>
      <DialogOverlay>
        <DialogContent>Hello</DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
