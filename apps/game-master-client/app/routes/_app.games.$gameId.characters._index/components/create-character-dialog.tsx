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
}

export function CreateCharacterSlideover({ gameId }: CreateCharacterProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Create Character</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Character</DialogTitle>
              </DialogHeader>
              <CreateCharacterForm gameId={gameId} close={close} />
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
