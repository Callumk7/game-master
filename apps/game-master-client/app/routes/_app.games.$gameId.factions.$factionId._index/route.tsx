import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { updateFactionDetails } from "~/actions/factions.server";
import { FactionOverview } from "./faction-overview";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { factionId } = parseParams(params, { factionId: z.string() });
  const result = await updateFactionDetails(request, factionId);
  return result;
};

export { FactionOverview as default };
