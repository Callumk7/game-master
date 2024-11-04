import { Outlet } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityToolbar } from "~/components/entity-toolbar";
import { FactionNavigation } from "./components/navigation";
import type { loader } from "./route";

export function FactionLayout() {
  const { factionDetails, folders } = useTypedLoaderData<typeof loader>();
  return (
    <>
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
    </>
  );
}
