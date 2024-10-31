import { Outlet } from "@remix-run/react";
import { GameNavbar } from "./components/game-navbar";

export default function GameLayout() {
  return (
    <div className="flex flex-col gap-y-4">
      <GameNavbar />
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
