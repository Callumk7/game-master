import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const notes = await api.notes.getAllGameNotes(gameId);
  return typedjson({ notes });
};

export default function NotesLayout() {
  const { notes } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <p>Notes sidebar</p>
      <Outlet />
    </div>
  );
}
