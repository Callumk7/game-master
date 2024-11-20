import { redirect } from "@remix-run/node";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  return redirect("/games");
};
