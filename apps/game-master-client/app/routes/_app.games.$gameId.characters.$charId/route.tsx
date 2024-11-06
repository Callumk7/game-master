import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, type Params } from "@remix-run/react";
import {
  redirect,
  typedjson,
  useTypedLoaderData,
  useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { EntityToolbar } from "~/components/entity-toolbar";
import { createApiFromReq } from "~/lib/api.server";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";
import { methodNotAllowed } from "~/util/responses";
import { deleteCharacter, duplicateCharacter } from "./actions.server";
import { CharacterNavigation } from "./components/navigation";
import { useState } from "react";
import { EditCharacterDialog } from "./components/edit-character-dialog";
import { updateCharacter } from "~/queries/server/update-character.server";

const getParams = (params: Params) => {
  return parseParams(params, {
    charId: z.string(),
    gameId: z.string(),
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const { charId, gameId } = getParams(params);
  const [characterDetails, charNotes, folders] = await resolve(
    getData(() => api.characters.getCharacterWithPermissions(charId)),
    getData(() => api.characters.getNotes(charId)),
    getData(() => api.folders.getGameFolders(gameId)),
  );

  if (characterDetails.userPermissionLevel === "none") {
    return redirect(`/games/${gameId}/characters`);
  }

  return typedjson({ characterDetails, charNotes, folders });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  const { charId } = getParams(params);

  if (request.method === "POST") {
    return duplicateCharacter(request, api, charId, userId);
  }

  if (request.method === "DELETE") {
    return deleteCharacter(api, charId);
  }

  if (request.method === "PATCH") {
    return updateCharacter(request, api, charId);
  }

  return methodNotAllowed();
};

export default function CharacterRoute() {
  const { characterDetails, folders } = useTypedLoaderData<typeof loader>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <div className="flex items-center w-full justify-between">
        <CharacterNavigation
          charId={characterDetails.id}
          gameId={characterDetails.gameId}
        />
        <EntityToolbar
          entityOwnerId={characterDetails.ownerId}
          gameId={characterDetails.gameId}
          entityVisibility={characterDetails.visibility}
          permissions={characterDetails.permissions}
          userPermissionLevel={characterDetails.userPermissionLevel!}
          folders={folders}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      </div>
      <Outlet />
      <EditCharacterDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        character={characterDetails}
      />
    </>
  );
}

export const useCharacterData = () => {
  const data = useTypedRouteLoaderData<typeof loader>(
    "routes/_app.games.$gameId.characters.$charId",
  );

  if (data === undefined) {
    throw new Error(
      "useCharacterData must be used within the characters.$charId route tree or its children",
    );
  }

  return data;
};
