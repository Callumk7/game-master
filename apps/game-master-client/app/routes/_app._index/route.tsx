import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Text } from "~/ui/typeography";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { Link } from "~/components/ui/link";

export const meta: MetaFunction = () => {
  return [
    { title: "Game Master: Notes for Heroes" },
    {
      name: "description",
      content: "Take your notes to the next level with Game Master",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const ownedGames = await api.games.getOwnedGames(userId);
  return typedjson({ ownedGames });
};

export default function Index() {
  const { ownedGames } = useTypedLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <div className="flex flex-col gap-1">
        {ownedGames.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            {game.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
