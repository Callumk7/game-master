import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useParams } from "@remix-run/react";
import { updateFolderSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Text } from "~/components/ui/typeography";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { FolderControls } from "./components/folder-controls";

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
  const params = useParams();
  const folderId = params.folderId;
  if (!folderId) throw new Error("No folderId");
  return (
    <div className="p-4 space-y-4">
      <FolderControls folderId={folderId} />
      <Text>Folder Route</Text>
    </div>
  );
}
