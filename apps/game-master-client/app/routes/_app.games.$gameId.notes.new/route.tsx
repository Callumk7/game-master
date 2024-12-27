import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { json, useLoaderData } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";
import { CreateNoteForm } from "~/components/forms/note-forms";
import { validateUser } from "~/lib/auth.server";
import { createNoteAction } from "~/queries/server/create-note.server";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const userId = await validateUser(request);
  return json({ userId, gameId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    return await createNoteAction(request);
  }

  return methodNotAllowed();
};

export default function NewNoteRoute() {
  const { gameId } = useLoaderData<typeof loader>();
  return (
    <div>
      <CreateNoteForm gameId={gameId} />
    </div>
  );
}
