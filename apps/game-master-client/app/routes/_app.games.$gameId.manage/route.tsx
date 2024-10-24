import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { updateGameSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { JollyTextField } from "~/components/ui/textfield";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { unsuccessfulResponse } from "~/util/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { gameId } = parseParams(params, { gameId: z.string() });
  const gameData = await api.games.getGame(gameId);
  return json({ game: gameData });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { gameId } = parseParams(params, { gameId: z.string() });
  const { name, description } = await parseForm(request, updateGameSchema);
  const result = await api.games.updateGameDetails(gameId, { name, description });

  if (!result.success) {
    return unsuccessfulResponse(result.message);
  }

  return redirect(`/games/${gameId}`);
};

export default function ManageGameRoute() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <div>
      <Card className="w-4/5 mx-auto">
        <Form method="post">
          <CardHeader>
            <CardTitle>Update Game Details</CardTitle>
            <CardDescription>
              Give your players some details on this game, that they can see on the game
              home screen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <JollyTextField label="Game Name" name="name" defaultValue={game.name} />
              <JollyTextField
                textArea
                label="Description"
                name="description"
                defaultValue={game.description ?? "A few words to describe this game?"}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save</Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
