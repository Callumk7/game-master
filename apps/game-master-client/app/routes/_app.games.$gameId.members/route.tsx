import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { parseForm, parseParams } from "zodix";
import { z } from "zod";
import { api } from "~/lib/api.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { MemberSearchDialog } from "./components/member-search-dialog";
import { MemberTable } from "./components/member-table";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { roleSchema } from "@repo/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  const game = await api.games.getGameWithMembers(gameId);

  return typedjson({ game });
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const { gameId } = parseParams(params, { gameId: z.string() });
  if (request.method === "PATCH") {
    const { userId, role } = await parseForm(request, {
      userId: z.string(),
      role: roleSchema,
    });
    const result = await api.games.editMember(gameId, userId, { role });

    if (!result.success) {
      return unsuccessfulResponse(result.message);
    }

    return typedjson(result.data);
  }

  if (request.method === "DELETE") {
    const { userId } = await parseForm(request, { userId: z.string() });
    const result = await api.games.removeMember(gameId, userId);
    return typedjson(result);
  }
  return methodNotAllowed();
};

export default function MembersRoute() {
  const { game } = useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <MemberSearchDialog />
      <MemberTable members={game.members} />
    </div>
  );
}
