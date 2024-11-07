import { Form, type FormProps, useSubmit } from "@remix-run/react";
import type { Faction } from "@repo/api";
import { cn } from "callum-util";
import { type FormEventHandler, useState } from "react";
import { EditorWithControls, useDefaultEditor } from "../editor";
import { Button } from "../ui/button";
import { JollyTextField } from "../ui/textfield";

interface BaseFactionFormProps<T extends Faction> extends FormProps {
  faction?: T;
  name?: string;
  setName?: (name: string) => void;
}

function BaseFactionForm<T extends Faction>({
  faction,
  className,
  children,
  name,
  setName,
  ...props
}: BaseFactionFormProps<T>) {
  return (
    <Form {...props}>
      <div className={cn(className, "space-y-2")}>
        <JollyTextField
          label="Name"
          name="name"
          defaultValue={faction?.name}
          value={name}
          onInput={setName ? (e) => setName(e.currentTarget.value) : undefined}
        />
        {children}
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}

interface CreateFactionFormProps {
  gameId: string;
  close?: () => void;
}
export function CreateFactionForm({ gameId, close }: CreateFactionFormProps) {
  const editor = useDefaultEditor();
  const [name, setName] = useState("");
  const submit = useSubmit();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!editor) {
      return null;
    }

    const content = editor.getText();
    const htmlContent = editor.getHTML();

    submit({ content, htmlContent, name, gameId }, { method: "POST" });
    if (close) close();
  };
  return (
    <BaseFactionForm name={name} setName={setName} onSubmit={handleSubmit}>
      <EditorWithControls
        editor={editor}
        bordered
        label="Faction Description"
        className="min-h-64"
      />
    </BaseFactionForm>
  );
}
