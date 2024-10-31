import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { FactionNavigation } from "./components/navigation";
import { EntityToolbar } from "~/components/entity-toolbar";
import { Outlet } from "@remix-run/react";

export function FactionLayout() {
  const { factionDetails, folders } = useTypedLoaderData<typeof loader>();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center w-full justify-between">
        <FactionNavigation gameId={factionDetails.gameId} factionId={factionDetails.id} />
        <EntityToolbar
          entityOwnerId={factionDetails.ownerId}
          gameId={factionDetails.gameId}
          entityVisibility={factionDetails.visibility}
          permissions={factionDetails.permissions}
          userPermissionLevel={factionDetails.userPermissionLevel!}
          folders={folders}
        />
      </div>
      <Outlet />
    </div>
  );
}
