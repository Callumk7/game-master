import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import type { CreateGameRequestBody } from "@repo/api";
import { z } from "zod";
import { parseForm } from "zodix";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { createApi, extractDataFromResponseOrThrow } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);

  const { name } = await parseForm(request, { name: z.string() });

  const input: CreateGameRequestBody = {
    name: name,
    ownerId: userId,
  };

  const result = await api.games.create(input);
  const newGame = extractDataFromResponseOrThrow(result);

  return redirect(`/games/${newGame.id}`);
};

export default function NewGameRoute() {
  return (
    <div className="p-6">
      <Form method="post" className="flex flex-col gap-4 max-w-80">
        <JollyTextField type="text" label="Name" name="name" isRequired />
        <Button className="w-fit" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
