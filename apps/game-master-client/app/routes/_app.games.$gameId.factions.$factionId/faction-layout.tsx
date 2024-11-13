import { Outlet } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityToolbar } from "~/components/entity-toolbar";
import { FactionNavigation } from "./components/navigation";
import type { loader } from "./route";
import { useState } from "react";

export function FactionLayout() {
  const { factionDetails, folders } = useTypedLoaderData<typeof loader>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <div className="sticky top-[86px] z-20 flex items-center w-full justify-between">
        <FactionNavigation gameId={factionDetails.gameId} factionId={factionDetails.id} />
        <EntityToolbar
          entityOwnerId={factionDetails.ownerId}
          gameId={factionDetails.gameId}
          entityVisibility={factionDetails.visibility}
          permissions={factionDetails.permissions}
          userPermissionLevel={factionDetails.userPermissionLevel!}
          folders={folders}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      </div>
      <Outlet />
    </>
  );
}
