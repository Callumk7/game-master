import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { LinkedFactionList } from "./components/faction-list";
import { LinkFactionDialog } from "./components/link-faction-dialog";
import { PrimaryFaction } from "./components/primary-faction";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const { charId, gameId } = parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
  const api = createApi(userId);
  const primaryFaction = await api.characters.getPrimaryFaction(charId);
  const charFactions = await api.characters.getFactions(charId);
  const allFactions = await api.factions.getAllGameFactions(gameId);

  return typedjson({ charId, charFactions, allFactions, primaryFaction });
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

  if (request.method === "DELETE") {
    const { factionId, characterId } = await parseForm(request, {
      factionId: z.string(),
      characterId: z.string(),
    });
    await api.characters.unlinkFaction(characterId, factionId);
    return null;
  }
};

export default function CharacterFactionsRoute() {
  const { charId, allFactions, charFactions, primaryFaction } =
    useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      {primaryFaction ? (
        <PrimaryFaction faction={primaryFaction} members={primaryFaction.members} />
      ) : null}
      <LinkFactionDialog allFactions={allFactions} />
      <LinkedFactionList characterId={charId} factions={charFactions} />
    </div>
  );
}
