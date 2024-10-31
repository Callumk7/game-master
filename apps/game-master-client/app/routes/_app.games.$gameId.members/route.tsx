import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { roleSchema } from "@repo/api";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { MemberSearchDialog } from "./components/member-search-dialog";
import { MemberTable } from "./components/member-table";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { gameId } = parseParams(params, { gameId: z.string() });
  const game = await api.games.getGameWithMembers(gameId);

  return typedjson({ game });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
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

  if (request.method === "PUT") {
    try {
      const { userIds } = (await request.json()) as { userIds: string[] };
      console.log(userIds);

      const result = await api.games.updateMembers(gameId, userIds);

      if (!result.success) {
        return unsuccessfulResponse(result.message);
      }

      return typedjson(result.data);
    } catch (error) {
      console.error(error);
      return unsuccessfulResponse(String(error));
    }
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
      <MemberSearchDialog memberIds={game.members.map((member) => member.id)} />
      <MemberTable members={game.members} />
    </div>
  );
}
