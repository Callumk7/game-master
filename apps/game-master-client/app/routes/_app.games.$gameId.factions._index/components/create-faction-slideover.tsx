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
            <div className="overflow-y-auto max-h-[95vh]">
              <div className="space-y-6 p-[1px]">
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
