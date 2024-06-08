import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { Container, EntityHeader, EntityView } from "~/components/layout";
import { Outlet } from "@remix-run/react";
import { Menu, MenuItem } from "~/components/ui/menu";
import { Button } from "~/components/ui/button";
import { DialogTrigger } from "react-aria-components";
import { NavigationLinks } from "~/components/navigation";

export function SessionLayout() {
	const { session } = useTypedLoaderData<typeof loader>();
	const links = [
		{
			name: "Notes",
			href: `/sessions/${session.id}`,
		},
		{
			name: "Links",
			href: `/sessions/${session.id}/links`,
		},
	];
	return (
		<Container>
			<EntityView menu={<SessionMenu />}>
				<EntityHeader title={session.name} />
				<NavigationLinks links={links} />
				<Outlet />
			</EntityView>
		</Container>
	);
}

function SessionMenu() {
	return (
		<DialogTrigger>
			<Button>Menu</Button>
			<Menu>
				<MenuItem>Delete</MenuItem>
				<MenuItem>Pin</MenuItem>
				<MenuItem>Archive</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
