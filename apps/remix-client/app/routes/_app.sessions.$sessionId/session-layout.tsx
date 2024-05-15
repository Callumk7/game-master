import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./route";
import { Container, EntityHeader, EntityView } from "~/components/layout";
import { Outlet } from "@remix-run/react";
import { Menu, MenuItem } from "~/components/ui/menu";
import { Button } from "~/components/ui/button";
import { DialogTrigger } from "react-aria-components";

export function SessionLayout() {
	const { session } = useTypedLoaderData<typeof loader>();
	return (
		<Container>
			<EntityView>
				<SessionMenu />
				<EntityHeader title={session.name} />
				<Outlet />
			</EntityView>
		</Container>
	);
}

function SessionMenu() {
	return (
		<DialogTrigger>
			<Button variant="secondary" size="sm">
				Menu
			</Button>
			<Menu>
				<MenuItem>Delete</MenuItem>
				<MenuItem>Pin</MenuItem>
				<MenuItem>Archive</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
