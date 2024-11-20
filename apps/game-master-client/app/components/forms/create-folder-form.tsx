import { Form } from "@remix-run/react";
import { JollyTextField } from "../ui/textfield";
import type { BasicEntity } from "@repo/api";
import { JollySelect, SelectItem } from "../ui/select";
import { Button } from "../ui/button";

interface CreateFolderFormProps {
  gameId: string;
  folders?: BasicEntity[];
  close?: () => void;
}

export function CreateFolderForm({ gameId, close, folders }: CreateFolderFormProps) {
  return (
    <Form onSubmit={close} method="POST">
      <div className="space-y-2">
        <JollyTextField type="text" label="Name" name="name" />
        {folders ? (
          <JollySelect items={folders} label="Parent folder" name="parentFolderId">
            {(item) => <SelectItem>{item.name}</SelectItem>}
          </JollySelect>
        ) : null}
        <input type="hidden" name="gameId" value={gameId} />
        <Button type="submit">Create Folder</Button>
      </div>
    </Form>
  );
}
