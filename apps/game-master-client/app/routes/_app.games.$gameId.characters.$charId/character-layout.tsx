import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityToolbar } from "~/components/entity-toolbar";
import { EditCharacterDialog } from "~/components/forms/edit-character-dialog";
import { CharacterNavigation } from "./components/navigation";
import type { loader } from "./route";

export function CharacterLayout() {
  const { characterDetails, folders } = useTypedLoaderData<typeof loader>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <div className="sticky top-[86px] z-20 flex items-center w-full justify-between">
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
