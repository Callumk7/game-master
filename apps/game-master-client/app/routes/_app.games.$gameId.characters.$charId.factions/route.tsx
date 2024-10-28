import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { FactionTable } from "~/components/tables/faction-table";
import { LinkFactionDialog } from "./components/link-faction-dialog";

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
    const { factionId, isPrimary } = await parseForm(request, {
      factionId: z.string(),
      isPrimary: z.string().optional(),
    });
    if (isPrimary) {
      await api.characters.updateCharacterDetails(charId, {
        primaryFactionId: factionId,
      });
    }
    const result = await api.characters.linkFactions(charId, [factionId]);
    return typedjson(result);
  }
};

export default function CharacterFactionsRoute() {
  const { allFactions, charFactions } = useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <LinkFactionDialog allFactions={allFactions} />
      <FactionTable factions={charFactions} />
    </div>
  );
}
