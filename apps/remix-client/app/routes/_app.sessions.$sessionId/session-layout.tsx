import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { EntityHeader, EntityView } from "~/components/layout";
import { Outlet } from "@remix-run/react";
import { NavigationLinks } from "~/components/navigation";
import { SessionMenu } from "./components/session-menu";

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
		<EntityView top margin menu={<SessionMenu sessionId={session.id} />}>
			<EntityHeader title={session.name} />
			<NavigationLinks links={links} />
			<Outlet />
		</EntityView>
	);
}
