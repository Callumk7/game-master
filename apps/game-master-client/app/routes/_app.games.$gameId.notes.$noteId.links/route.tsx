import type { ActionFunctionArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { Layout } from "~/components/layout";
import { LinkNotesPopover } from "~/components/linking/link-notes";
import { AllEntityTable } from "~/components/tables/all-entities";
import { createApiFromReq } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";
import { useNoteData } from "../_app.games.$gameId.notes.$noteId/route";
import { useGameData } from "../_app.games.$gameId/route";
import { updateLinks } from "./actions.server";

const getParams = (params: Params) => {
  return parseParams(params, {
    noteId: z.string(),
    gameId: z.string(),
  });
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { noteId } = getParams(params);
  if (request.method === "PUT") {
    return await updateLinks(request, api, noteId);
  }
  return methodNotAllowed();
};

export default function NotesLinkRoute() {
  const { note, linkedNotes, linkedChars, linkedFactions } = useNoteData();
  const { notes } = useGameData();
  return (
    <Layout>
      <LinkNotesPopover allNotes={notes} entityNotes={linkedNotes.outgoingLinks} />
      <AllEntityTable
        notes={linkedNotes.outgoingLinks}
        characters={linkedChars}
        factions={linkedFactions}
      />
    </Layout>
  );
}
