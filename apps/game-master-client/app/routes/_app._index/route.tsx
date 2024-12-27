import { redirect } from "react-router";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  return redirect("/games");
};
