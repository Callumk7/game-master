import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useRouteError, useRouteLoaderData } from "@remix-run/react";
import { Text } from "~/components/ui/typeography";
import { createApiFromReq } from "~/lib/api.server";
import { auth } from "~/lib/auth";
import { getData } from "~/util/handle-error";
import { AppLayout } from "./root-layout";
import { client } from "~/api/client.gen";

export const meta: MetaFunction = () => {
  return [
    { title: "Game Master: Notes for Heroes" },
    {
      name: "description",
      content: "Take your notes to the next level with Game Master",
    },
  ];
};

client.setConfig({
  headers: {
    Authorization: "Bearer l2PwxuwVDrhhDmEoJs2se9SOwCSku63xBqOPaXFAXm4",
  },
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { userId, api } = await createApiFromReq(request);
  const userGames = await getData(() => api.users.games(userId));
  const session = await auth.api.getSession({ headers: request.headers });

  if (session?.user) {
    return { userGames, userData: session.user };
  }

  throw redirect("/login");
};

export function useAppData() {
  const data = useRouteLoaderData<typeof loader>("routes/_app");
  if (data === undefined) {
    throw new Error("useAppData must be used within the _app route or its children");
  }
  return data;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="mx-auto w-4/5">
      <Text variant={"h3"} className="pt-20 w-full text-center">
        Something went wrong:
      </Text>
      <p>{JSON.stringify(error)}</p>
    </div>
  );
}

export { AppLayout as default };
