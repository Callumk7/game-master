import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useParams } from "@remix-run/react";
import { updateFolderSchema } from "@repo/api";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { AllEntityTable } from "~/components/tables/all-entities";
import { Text } from "~/components/ui/typeography";
import { createApi, createApiFromReq } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  // Detailed view of the folder contents, and we need to have stuff
  // for moving other stuff around. Again, would be good to audit what we already
  // have got fetched, but for the most part remix should handle the situation to a
  // good baseline

  const { folderId } = parseParams(params, { folderId: z.string() });

  const { api } = await createApiFromReq(request);
  const folderWithChildren = await api.folders.getFolderWithChildren(folderId);
  return typedjson({ folderWithChildren });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { folderId } = parseParams(params, { folderId: z.string() });
  if (request.method === "PATCH") {
    const { name } = await parseForm(request, updateFolderSchema);
    const result = await api.folders.updateFolder(folderId, { name });
    if (result.success) {
      return json(result.data);
    }

    return json(result);
  }
  if (request.method === "DELETE") {
    const result = await api.folders.deleteFolder(folderId);

    if (result.success) {
      return redirect("/");
    }

    return json(result);
  }
};

export default function FolderRoute() {
  const { folderWithChildren } = useTypedLoaderData<typeof loader>();
  const params = useParams();
  const folderId = params.folderId;
  if (!folderId) throw new Error("No folderId");
  return (
    <div className="p-4 space-y-4">
      <Text>{folderWithChildren.name}</Text>
      <AllEntityTable
        notes={folderWithChildren.notes}
        characters={folderWithChildren.characters}
        factions={folderWithChildren.factions}
      />
    </div>
  );
}
