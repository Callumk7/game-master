import { Form, type FormProps, useSubmit } from "@remix-run/react";
import type { Character } from "@repo/api";
import { cn } from "callum-util";
import { type FormEventHandler, useState } from "react";
import { EditorWithControls, useDefaultEditor } from "../editor";
import { Button } from "../ui/button";
import { JollyNumberField } from "../ui/numberfield";
import { JollyTextField } from "../ui/textfield";

interface BaseCharacterFormProps<T extends Character> extends FormProps {
  character?: T;
  name?: string;
  setName?: (name: string) => void;
  race?: string;
  setRace?: (race: string) => void;
  characterClass?: string;
  setCharacterClass?: (characterClass: string) => void;
  level?: number;
  setLevel?: (level: number) => void;
}

function BaseCharacterForm<T extends Character>({
  character,
  name,
  characterClass,
  setCharacterClass,
  race,
  setRace,
  level,
  setLevel,
  setName,
  children,
  className,
  ...props
}: BaseCharacterFormProps<T>) {
  return (
    <Form {...props}>
      <div className={cn(className, "space-y-2")}>
        <JollyTextField
          label="Name"
          name="name"
          defaultValue={character?.name}
          value={name}
          onInput={setName ? (e) => setName(e.currentTarget.value) : undefined}
        />
        <JollyTextField
          label="Race"
          name="race"
          defaultValue={character?.race ?? undefined}
          value={race}
          onInput={setRace ? (e) => setRace(e.currentTarget.value) : undefined}
        />
        <div className="flex gap-2 w-full">
          <JollyTextField
            className="w-2/3"
            label="Class"
            name="characterClass"
            defaultValue={character?.characterClass ?? undefined}
            value={characterClass}
            onInput={
              setCharacterClass
                ? (e) => setCharacterClass(e.currentTarget.value)
                : undefined
            }
          />
          <JollyNumberField
            className="w-1/3"
            label="Level"
            name="level"
            defaultValue={character?.level}
            value={level}
            onInput={
              setLevel ? (e) => setLevel(Number(e.currentTarget.value)) : undefined
            }
          />
        </div>
        {children}
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}

interface CreateCharacterFormProps {
  gameId: string;
  close?: () => void;
}

export function CreateCharacterForm({ gameId, close }: CreateCharacterFormProps) {
  const editor = useDefaultEditor();
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState(0);
  const submit = useSubmit();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!editor) {
      alert("No editor!"); // TODO: ????
      return null;
    }

    const content = editor.getText();
    const htmlContent = editor.getHTML();

    submit(
      { content, htmlContent, name, gameId, race, characterClass, level },
      { method: "post" },
    );

    if (close) close();
  };
  return (
    <BaseCharacterForm
      name={name}
      setName={setName}
      race={race}
      setRace={setRace}
      characterClass={characterClass}
      setCharacterClass={setCharacterClass}
      level={level}
      setLevel={setLevel}
      onSubmit={handleSubmit}
    >
      <EditorWithControls editor={editor} bordered label="Description" />
    </BaseCharacterForm>
  );
}

interface EditCharacterFormProps {
  character: Character;
  close?: () => void;
}
export function EditCharacterForm({ character, close }: EditCharacterFormProps) {
  return (
    <BaseCharacterForm method="PATCH" onSubmit={close} character={character}>
      <div className="grid grid-cols-2 gap-2 py-6">
        <JollyNumberField
          label="Strength"
          name="strength"
          defaultValue={character.strength ?? undefined}
        />
        <JollyNumberField
          label="Dexterity"
          name="dexterity"
          defaultValue={character.dexterity ?? undefined}
        />
        <JollyNumberField
          label="Constitution"
          name="constitution"
          defaultValue={character.constitution ?? undefined}
        />
        <JollyNumberField
          label="Intelligence"
          name="intelligence"
          defaultValue={character.intelligence ?? undefined}
        />
        <JollyNumberField
          label="Wisdom"
          name="wisdom"
          defaultValue={character.wisdom ?? undefined}
        />
        <JollyNumberField
          label="Charisma"
          name="charisma"
          defaultValue={character.charisma ?? undefined}
        />
      </div>
      <JollyTextField
        textArea
        label="Goals"
        name="goal"
        defaultValue={character.goal ?? undefined}
      />
      <JollyTextField
        textArea
        label="Flaws"
        name="flaw"
        defaultValue={character.flaw ?? undefined}
      />
      <JollyTextField
        textArea
        label="Personality"
        name="personality"
        defaultValue={character.personality ?? undefined}
      />
      <input type="hidden" value={character.id} name="charId" />
    </BaseCharacterForm>
  );
}
