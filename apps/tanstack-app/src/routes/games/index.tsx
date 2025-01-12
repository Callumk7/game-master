import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../../components/protected-route";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <div className="bg-black">Hello "/games/"!</div>
    </ProtectedRoute>
  );
}
