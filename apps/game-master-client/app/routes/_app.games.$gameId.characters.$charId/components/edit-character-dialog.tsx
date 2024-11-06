import { Form } from "@remix-run/react";
import type { Character } from "@repo/api";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { JollyNumberField } from "~/components/ui/numberfield";
import { JollyTextField } from "~/components/ui/textfield";

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

interface EditCharacterFormProps {
  character: Character;
  close?: () => void;
}
export function EditCharacterForm({ character, close }: EditCharacterFormProps) {
  return (
    <Form method="PATCH" onSubmit={close}>
      <div className="space-y-2">
        <JollyTextField label="Name" name="name" defaultValue={character.name} />
        <JollyTextField label="Race" name="race" defaultValue={character.race} />
        <div className="flex gap-2 w-full">
          <JollyTextField
            className="w-2/3"
            label="Class"
            name="class"
            defaultValue={character.class}
          />
          <JollyNumberField
            className="w-1/3"
            label="Level"
            name="level"
            defaultValue={character.level}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 py-6">
          <JollyNumberField
            label="Strength"
            name="str"
            defaultValue={character.strength}
          />
          <JollyNumberField
            label="Dexterity"
            name="dexterity"
            defaultValue={character.dexterity}
          />
          <JollyNumberField
            label="Constitution"
            name="constitution"
            defaultValue={character.constitution}
          />
          <JollyNumberField
            label="Intelligence"
            name="intelligence"
            defaultValue={character.intelligence}
          />
          <JollyNumberField label="Wisdom" name="wis" defaultValue={character.wisdom} />
          <JollyNumberField
            label="Charisma"
            name="charisma"
            defaultValue={character.charisma}
          />
        </div>
        <JollyTextField
          textArea
          label="Goals"
          name="goal"
          defaultValue={character.goal}
        />
        <JollyTextField
          textArea
          label="Flaws"
          name="flaw"
          defaultValue={character.flaw}
        />
        <JollyTextField
          textArea
          label="Personality"
          name="personality"
          defaultValue={character.personality}
        />
        <input type="hidden" value={character.id} name="charId" />
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
