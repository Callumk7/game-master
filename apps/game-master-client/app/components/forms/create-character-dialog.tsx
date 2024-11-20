import { CreateCharacterForm } from "~/components/forms/character-forms";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface CreateCharacterProps {
  gameId: string;
  factionId?: string;
}

export function CreateCharacterSlideover({ gameId, factionId }: CreateCharacterProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Create Character</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="overflow-y-auto max-h-[95vh]">
              <div className="space-y-6 p-[1px]">
                <DialogHeader>
                  <DialogTitle>Create Character</DialogTitle>
                </DialogHeader>
                <CreateCharacterForm
                  gameId={gameId}
                  close={close}
                  factionId={factionId}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
