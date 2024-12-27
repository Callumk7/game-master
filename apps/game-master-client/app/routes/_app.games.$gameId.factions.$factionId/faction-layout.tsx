import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { EntityToolbar } from "~/components/entity-toolbar";
import { ScrollFade } from "~/components/scroll-visibility";
import { FactionNavigation } from "./components/navigation";
import type { loader } from "./route";

export function FactionLayout() {
  const { factionDetails, folders } = useLoaderData<typeof loader>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <div className="flex sticky z-20 justify-between items-center w-full top-[86px]">
        <ScrollFade>
          <FactionNavigation
            gameId={factionDetails.gameId}
            factionId={factionDetails.id}
          />
        </ScrollFade>
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
