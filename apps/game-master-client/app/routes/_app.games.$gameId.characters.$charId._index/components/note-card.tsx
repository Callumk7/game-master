import { Link1Icon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import type { Note } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DialogContent, DialogOverlay, DialogTrigger } from "~/components/ui/dialog";
import { JollySelect, SelectItem } from "~/components/ui/select";
import { Text } from "~/components/ui/typeography";

interface NoteCardProps {
  notes: Note[];
}

export function NoteCard({ notes }: NoteCardProps) {
  return (
    <Card className="p-4">
      <div className="flex w-full items-center justify-between">
        <Text variant={"h3"}>Notes</Text>
        <DialogTrigger>
          <Button variant={"outline"} size={"icon"}>
            <Link1Icon />
          </Button>
          <DialogOverlay>
            <DialogContent>
              <Form method="POST" className="space-y-4">
                <JollySelect items={notes} name="noteId">
                  {(item) => <SelectItem>{item.name}</SelectItem>}
                </JollySelect>
                <Button type="submit">Link</Button>
              </Form>
            </DialogContent>
          </DialogOverlay>
        </DialogTrigger>
      </div>
      {notes.map((note) => (
        <Card key={note.id} className="p-3">
          <Text variant={"h4"}>{note.name}</Text>
          <p className="text-xs whitespace-pre-wrap max-h-20 overflow-clip">
            {note.content}
          </p>
        </Card>
      ))}
    </Card>
  );
}
