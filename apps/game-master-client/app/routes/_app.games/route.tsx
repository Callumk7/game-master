import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";
import { api } from "~/lib/api.server";
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
      <ListBox items={ownedGames} aria-label="Owned Games" selectionMode="single" className={"max-w-32"}>
      {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
			<Outlet />
		</div>
	);
}
