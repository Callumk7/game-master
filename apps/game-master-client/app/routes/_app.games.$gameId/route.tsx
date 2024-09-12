import { Outlet } from "@remix-run/react";
import { GameSettingsMenu } from "./components/game-settings-menu";

export default function GameLayout() {
  return (
    <div className="p-4 space-y-4">
      <GameSettingsMenu gameId="string" />
      <Outlet />
    </div>
  );
}
