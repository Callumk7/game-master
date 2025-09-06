import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getGameOptions } from "~/api/@tanstack/react-query.gen";

export const Route = createFileRoute("/_auth/example")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData({
      ...getGameOptions({
        path: { id: 4 },
        client: context.client,
      }),
    });
  },
});

function RouteComponent() {
  const ctx = Route.useRouteContext();
  const {
    data: { data: game },
  } = useSuspenseQuery({
    ...getGameOptions({
      path: { id: 4 },
      client: ctx.client,
    }),
  });

  return (
    <div>
      <h1>This is a protected route</h1>
      <p>You must be logged in! You are {ctx.user?.email}</p>
      <p>This is the game {game?.name}</p>
    </div>
  );
}
