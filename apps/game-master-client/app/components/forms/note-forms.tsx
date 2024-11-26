import { Form, useSubmit, type FormProps } from "@remix-run/react";
import type { CreateNoteRequestBody, Note, NoteType, Visibility } from "@repo/api";
import { cn } from "callum-util";
import { JollyTextField } from "../ui/textfield";
import { Button } from "../ui/button";
import { EditorWithControls, useDefaultEditor } from "../editor";
import { type FormEvent, type FormEventHandler, useState } from "react";
import { JollySelect, SelectItem } from "../ui/select";

interface BaseNoteFormProps<T extends Note> extends FormProps {
  note?: T;
  name?: string;
  setName?: (name: string) => void;
  visibility?: Visibility;
  setVisibility?: (vis: Visibility) => void;
  type?: NoteType;
  setType?: (type: NoteType) => void;
  handleSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export function BaseNoteForm<T extends Note>({
  note,
  name,
  setName,
  children,
  className,
  visibility,
  setVisibility,
  type,
  setType,
  handleSubmit,
  ...props
}: BaseNoteFormProps<T>) {
  return (
    <Form {...props} onSubmit={handleSubmit}>
      <div className={cn(className, "space-y-2")}>
        <JollyTextField
          label="Name"
          name="name"
          defaultValue={note?.name}
          value={name}
          onInput={setName ? (e) => setName(e.currentTarget.value) : undefined}
        />
        <div className="flex gap-4 justify-between w-full">
          <JollySelect
            name="type"
            className={"flex-1"}
            label="Note Type"
            defaultSelectedKey={note?.type ?? "Note"}
            onSelectionChange={setType ? (key) => setType(key as NoteType) : undefined}
          >
            <SelectItem id="note">Note</SelectItem>
            <SelectItem id="character">Character</SelectItem>
            <SelectItem id="faction">Faction</SelectItem>
            <SelectItem id="location">Location</SelectItem>
            <SelectItem id="item">Item</SelectItem>
            <SelectItem id="quest">Quest</SelectItem>
            <SelectItem id="scene">Scene</SelectItem>
          </JollySelect>
          <JollySelect
            name="visibility"
            className={"flex-1"}
            label="Visibility"
            defaultSelectedKey={note?.visibility ?? "private"}
            onSelectionChange={
              setVisibility ? (key) => setVisibility(key as Visibility) : undefined
            }
          >
            <SelectItem id="private">Private</SelectItem>
            <SelectItem id="viewable">Everyone can view</SelectItem>
            <SelectItem id="public">Everyone can edit</SelectItem>
          </JollySelect>
        </div>
        {children}
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}

interface CreateNoteFormProps {
  gameId: string;
  close?: () => void;
}

export function CreateNoteForm({ gameId, close }: CreateNoteFormProps) {
  const editor = useDefaultEditor();
  const [name, setName] = useState("");
  const [type, setType] = useState<NoteType>("note");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const submit = useSubmit();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!editor) {
      return null;
    }

    const content = editor.getText();
    const htmlContent = editor.getHTML();

    const validData: Omit<CreateNoteRequestBody, "ownerId"> = {
      content,
      htmlContent,
      name,
      gameId,
      type,
      visibility,
    };
    submit(validData, { method: "post" });
    if (close) close();
  };
  return (
    <BaseNoteForm
      method="POST"
      setName={setName}
      name={name}
      onSubmit={handleSubmit}
      setType={setType}
      setVisibility={setVisibility}
      handleSubmit={handleSubmit}
    >
      <EditorWithControls editor={editor} bordered label="Body" />
    </BaseNoteForm>
  );
}
