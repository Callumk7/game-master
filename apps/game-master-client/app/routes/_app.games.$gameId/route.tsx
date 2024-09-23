import { Outlet } from "@remix-run/react";
import { GameNavbar } from "./components/game-navbar";

export default function GameLayout() {
  return (
    <div className="space-y-4">
      <GameNavbar />
      <Outlet />
    </div>
  );
}
