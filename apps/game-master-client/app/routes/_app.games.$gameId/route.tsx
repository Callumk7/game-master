import { Outlet } from "@remix-run/react";
import { GameNavbar } from "./components/game-navbar";

export default function GameLayout() {
  return (
    <div className="p-4 space-y-4">
      <GameNavbar />
      <Outlet />
    </div>
  );
}
