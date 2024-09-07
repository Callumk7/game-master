import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EditorBody } from "~/components/editor";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Game Master: Notes for Heroes" },
    {
      name: "description",
      content: "Take your notes to the next level with Game Master",
    },
  ];
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const userId = await validateUser(request);
  const ownedGames = await api.games.getOwnedGames(userId);
  return json({ ownedGames });
};

export default function Index() {
  const { ownedGames } = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1>Index</h1>
      <EditorBody />
    </div>
  );
}
