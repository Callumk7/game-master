import { Form, useSubmit } from "@remix-run/react";
import { type FormEventHandler, useState } from "react";
import { EditorWithControls, useDefaultEditor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { JollyTextField } from "~/components/ui/textfield";
import { JollySelect, SelectItem } from "../ui/select";
import type { Visibility, NoteType, CreateNoteRequestBody } from "@repo/api";

interface CreateNoteProps {
  gameId: string;
}

export function CreateNoteSlideover({ gameId }: CreateNoteProps) {
  return (
    <DialogTrigger>
      <Button variant="outline">Add Note</Button>
      <DialogOverlay>
        <DialogContent side="right" className="sm:max-w-[425px]">
          {({ close }) => (
            <div className="max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Note</DialogTitle>
              </DialogHeader>
              <CreateNoteForm gameId={gameId} close={close} />
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
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

    console.log(validData);

    submit(validData, { method: "post" });
  };
  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4 px-1 h-full">
        <JollyTextField
          autoFocus
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          label="Title"
          isRequired
        />
        <div className="flex w-full justify-between gap-4">
          <JollySelect
            className={"flex-1"}
            label="Note Type"
            defaultSelectedKey={"note"}
            onSelectionChange={(key) => setType(key as NoteType)}
          >
            <SelectItem id="note">Note</SelectItem>
            <SelectItem id="character">Character</SelectItem>
            <SelectItem id="faction">Faction</SelectItem>
            <SelectItem id="location">Location</SelectItem>
            <SelectItem id="item">Item</SelectItem>
            <SelectItem id="quest">Quest</SelectItem>
          </JollySelect>
          <JollySelect
            className={"flex-1"}
            label="Visibility"
            defaultSelectedKey={"private"}
            onSelectionChange={(key) => setVisibility(key as Visibility)}
          >
            <SelectItem id="private">Private</SelectItem>
            <SelectItem id="viewable">Everyone can view</SelectItem>
            <SelectItem id="public">Everyone can edit</SelectItem>
          </JollySelect>
        </div>
        <EditorWithControls
          editor={editor}
          bordered
          label="Body"
          className="min-h-[50vh] h-full"
        />
      </div>
      <DialogFooter>
        <Button onPress={close} type="submit">
          Save
        </Button>
      </DialogFooter>
    </Form>
  );
}
