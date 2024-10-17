import type { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const { name, gameId } = await parseForm(request, {
    name: z.string(),
    gameId: z.string(),
  });
  const newFolder = await api.folders.createFolder({ name, gameId, ownerId: userId });

  if (!newFolder.success) {
    return { success: false };
  }

  return typedjson({ newFolder: newFolder.data });
};

export default function FolderLayout() {
	return <Outlet />
}
