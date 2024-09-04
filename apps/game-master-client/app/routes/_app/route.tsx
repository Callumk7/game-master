import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  return { userId };
};

export default function AppLayout() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="w-full p-4 bg-slate-400 text-slate-100">
        <p>{userId}</p>
      </div>
      <Outlet />
    </div>
  );
}
