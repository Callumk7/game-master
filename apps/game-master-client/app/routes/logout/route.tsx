import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { destroySession, getUserSession } from "~/lib/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
