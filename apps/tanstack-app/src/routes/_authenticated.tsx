import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="p-4 m-4 border border-red-400 rounded-md">
      <h2>This is an authenticated route</h2>
      <Outlet />
    </div>
  );
}
