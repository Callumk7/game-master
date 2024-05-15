import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { loader, useFactionRouteData } from "./route";
import { Header } from "~/components/typeography";
import { Form, Outlet, useFetcher, useSubmit } from "@remix-run/react";
import { useAppData } from "../_app/route";
import { LeaderSelect } from "./components/faction-leader";

export default function FactionView() {
	const { faction } = useFactionRouteData();
	return (
		<EntityView>
			<EntityHeader title={faction.name}>
				<LeaderSelect />
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
