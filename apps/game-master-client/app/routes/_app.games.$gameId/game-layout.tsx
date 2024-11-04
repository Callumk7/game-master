import { Outlet } from "@remix-run/react";
import { GameNavbar } from "./components/game-navbar";
import { GameSidebar } from "./components/game-sidebar";
import { useGameData } from "./route";

export default function GameLayout() {
  const { sidebarData } = useGameData();
  return (
    <div className="flex flex-col gap-y-4">
      <GameSidebar gameWithSidebarData={sidebarData} />
      <div className="ml-64 flex-1">
        <GameNavbar />
        <Outlet />
      </div>
    </div>
  );
}
