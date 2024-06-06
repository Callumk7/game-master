import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { post } from "~/lib/game-master";

export const action = async ({request, params, context}: ActionFunctionArgs) => {
  const formData = await request.formData(); 
  await post(context, "uploads", formData);
  return null
}
