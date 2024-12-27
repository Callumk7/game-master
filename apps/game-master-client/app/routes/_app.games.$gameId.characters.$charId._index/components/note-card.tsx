import { Link1Icon } from "@radix-ui/react-icons";
import { Form, Link } from "react-router";
import type { BasicEntity, Note } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DialogContent, DialogOverlay, DialogTrigger } from "~/components/ui/dialog";
import { JollySelect, SelectItem } from "~/components/ui/select";
import { Text } from "~/components/ui/typeography";

interface NoteCardProps {
  notes: BasicEntity[];
  charNotes: Note[];
}

export function NoteCard({ notes, charNotes }: NoteCardProps) {
  return (
    <div className="p-4 space-y-3 rounded-md border h-fit">
      <div className="flex justify-between items-center w-full">
        <Text variant={"h4"}>Linked Notes</Text>
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
      <div className="space-y-2">
        {charNotes.map((note) => (
          <Card key={note.id} className="p-3">
            <Link
              to={`/games/${note.gameId}/notes/${note.id}`}
              className="hover:text-lime-50 text-primary"
            >
              <Text variant={"h4"}>{note.name}</Text>
            </Link>
            <p className="max-h-20 text-xs whitespace-pre-wrap overflow-clip">
              {note.content}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
