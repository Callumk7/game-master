import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Button } from "~/components/ui/button";
import { JollySelect, SelectItem } from "~/components/ui/select";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { FactionTable } from "./components/faction-table";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const { charId, gameId } = parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
  const api = createApi(userId);
  const charFactions = await api.characters.getFactions(charId);
  const allFactions = await api.factions.getAllGameFactions(gameId);

  return typedjson({ charFactions, allFactions });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const { charId } = parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
  const api = createApi(userId);
  if (request.method === "POST") {
    const { factionId } = await parseForm(request, { factionId: z.string() });
    const result = await api.characters.linkFactions(charId, [factionId]);
    return typedjson(result);
  }
};

export default function CharacterFactionsRoute() {
  const { allFactions, charFactions } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <FactionTable factions={charFactions} />
      <Form className="w-64" method="POST">
        <JollySelect items={allFactions} name="factionId">
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </JollySelect>
        <Button type="submit">send</Button>
      </Form>
    </div>
  );
}
