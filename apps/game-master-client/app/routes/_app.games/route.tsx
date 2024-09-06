import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { api } from "~/lib/api";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const ownedGames = await api.games.getOwnedGames(userId);
	return json({ ownedGames });
};

export default function GamesLayout() {
	const { ownedGames } = useLoaderData<typeof loader>();
	return (
		<div>
			<p>This is the games layout</p>
			<div>
				{ownedGames.map((game) => (
					<p key={game.id}>{game.name}</p>
				))}
			</div>
			<Outlet />
		</div>
	);
}
