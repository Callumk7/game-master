import { Form } from "@remix-run/react";
import type { Faction } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { JollySelect, SelectItem } from "~/components/ui/select";

interface LinkFactionDialogProps {
  allFactions: Faction[];
}

export function LinkFactionDialog({ allFactions }: LinkFactionDialogProps) {
  return (
    <DialogTrigger>
      <Button>Link Faction</Button>
      <DialogOverlay>
        <DialogContent>
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>Link Faction to Character</DialogTitle>
              </DialogHeader>
              <Form className="p-2 space-y-4" method="POST" onSubmit={close}>
                <JollySelect label="Faction" items={allFactions} name="factionId">
                  {(item) => <SelectItem>{item.name}</SelectItem>}
                </JollySelect>
                <Checkbox name="isPrimary">Primary Faction?</Checkbox>
                <DialogFooter className="pt-4">
                  <Button type="submit">send</Button>
                </DialogFooter>
              </Form>
            </>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
