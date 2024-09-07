import { Outlet, useParams } from "@remix-run/react";

export default function GameLayout() {
  const { gameId } = useParams();
  return (
    <div>
      <Outlet />
    </div>
  );
}
