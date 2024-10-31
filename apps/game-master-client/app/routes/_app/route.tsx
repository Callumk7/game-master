import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { Text } from "~/components/ui/typeography";
import { createApiFromReq } from "~/lib/api.server";
import { getData } from "~/util/handle-error";
import { AppLayout } from "./root-layout";

export const meta: MetaFunction = () => {
  return [
    { title: "Game Master: Notes for Heroes" },
    {
      name: "description",
      content: "Take your notes to the next level with Game Master",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { userId, api } = await createApiFromReq(request);
  const sidebarData = await getData(() => api.users.getUserSidebarData(userId));

  return typedjson({ sidebarData, userId });
};

export function useAppData() {
  const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
  if (data === undefined) {
    throw new Error("useAppData must be used within the _app route or its children");
  }
  return data;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="w-4/5 mx-auto">
      <Text variant={"h3"}>Something went wrong</Text>
    </div>
  );
}

export { AppLayout as default };
