import { useFetcher } from "@remix-run/react";
import type { CreateNoteRequestBody } from "@repo/api";
import { useState } from "react";
import { EditorWithControls, useDefaultEditor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/textfield";

interface NewNoteEditorProps {
  userId: string;
  gameId: string;
  action?: string;
}

export function NewNoteEditor({ userId, gameId, action }: NewNoteEditorProps) {
  const fetcher = useFetcher();
  const editor = useDefaultEditor("What is on your mind?");
  const [name, setName] = useState("Title");

  const handleSave = () => {
    const newNoteInsert: CreateNoteRequestBody = {
      gameId,
      ownerId: userId,
      name,
      content: editor?.getText() ?? "",
      htmlContent: editor?.getHTML() ?? "",
      type: "note",
    };
    fetcher.submit(newNoteInsert, { method: "post", action });
  };
  return (
    <div className="border rounded-md p-4 space-y-4">
      <Input
        type="text"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
        className={"border-0 text-2xl font-semibold"}
        autoFocus
      />
      <EditorWithControls editor={editor} />
      <Button onPress={handleSave}>Save</Button>
    </div>
  );
}
