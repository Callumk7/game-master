import { Form } from "@remix-run/react";
import type { Id } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FieldError, Label } from "~/components/ui/field";
import { Input, TextField } from "~/components/ui/textfield";

interface NewNoteFormProps {
  gameId: Id;
}

export function NewNoteForm({ gameId }: NewNoteFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Note</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          className="flex flex-col gap-4"
          method="post"
          action={`/games/${gameId}?index`}
        >
          <TextField name="name" type="text" isRequired>
            <Label>Name</Label>
            <Input />
            <FieldError />
          </TextField>
          <Button type="submit">Create</Button>
        </Form>
      </CardContent>
    </Card>
  );
}
