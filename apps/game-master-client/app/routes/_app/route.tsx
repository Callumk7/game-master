import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { NavigationBar } from "~/components/navigation";
import { validateUser, validateUserSession } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  return json({ userId });
};

export default function AppLayout() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div>
      <NavigationBar />
      {userId}
      <Outlet />
    </div>
  );
}
