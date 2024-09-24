import { Outlet } from "@remix-run/react";
import { useSetRightSidebarOpen } from "~/store/selection";

export default function CharacterLayout() {
  const setIsRightSidebarOpen = useSetRightSidebarOpen();
  setIsRightSidebarOpen(false);
  return (
    <div>
      <Outlet />
    </div>
  );
}
