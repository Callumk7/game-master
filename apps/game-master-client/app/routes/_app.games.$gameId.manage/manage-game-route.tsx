import { Form } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
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
import type { loader } from "./route";

export function ManageGameRoute() {
  const { game } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <Card className="mx-auto w-4/5">
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
