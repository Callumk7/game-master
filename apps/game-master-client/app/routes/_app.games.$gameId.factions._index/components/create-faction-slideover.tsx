import { CreateFactionForm } from "~/components/forms/faction-forms";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface CreateFactionSlideoverProps {
  gameId: string;
}

export function CreateFactionSlideover({ gameId }: CreateFactionSlideoverProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Create Faction</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="max-h-[95vh] overflow-y-auto">
              <div className="p-[1px] space-y-6">
                <DialogHeader>
                  <DialogTitle>Create Faction</DialogTitle>
                </DialogHeader>
                <CreateFactionForm gameId={gameId} close={close} />
              </div>
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
