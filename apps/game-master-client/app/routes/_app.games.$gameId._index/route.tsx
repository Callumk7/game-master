import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditableText, Text } from "~/components/ui/typeography";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const { gameId } = parseParams(params, { gameId: z.string() });
  const api = createApi(userId);
  const game = await api.games.getGameWithMembers(gameId);

  return typedjson({ game });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { gameId } = parseParams(params, {
    gameId: z.string(),
  });

  if (request.method === "PATCH") {
    const { name } = await parseForm(request, {
      name: z.string(),
    });

    const result = await api.games.updateGameDetails(gameId, { name });

    if (!result.success) {
      return new Response("Error");
    }

    return typedjson(result.data);
  }

  return methodNotAllowed();
};

export default function GameRoute() {
  const { game } = useTypedLoaderData<typeof loader>();
  return (
    <div className="p-4 space-y-10">
      <div>
        <EditableText
          method="patch"
          fieldName={"name"}
          value={game.name}
          variant={"h2"}
          weight={"bold"}
          inputLabel={"Game name input"}
          buttonLabel={"Edit game name"}
        />
        <p className="whitespace-pre-wrap">{game.description}</p>
      </div>
      <div>
        <Text variant={"h2"} weight={"semi"}>
          Activity
        </Text>
        <p>Feature coming soon...</p>
      </div>
    </div>
  );
}
