import { createFileRoute } from "@tanstack/react-router";
import { login } from "../../lib/auth";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
  loader: () => login()
});

function RouteComponent() {
  return <div className="bg-black">Hello "/games/"!</div>;
}
