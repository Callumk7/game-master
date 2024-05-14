import { Outlet } from "@remix-run/react";
import { EntityView, EntityHeader } from "~/components/layout";
import { loader } from "./route";
import { useTypedLoaderData } from "remix-typedjson";
import { Link } from "~/components/ui/link";

export function CharacterView() {
	const { characterData } = useTypedLoaderData<typeof loader>();
	return (
		<EntityView top className="px-6">
			<EntityHeader title={characterData.name}>
				<div className="flex gap-x-6">
					<Link href={`/characters/${characterData.id}/notes`}>Notes</Link>
					<Link href={`/characters/${characterData.id}/links`}>Links</Link>
				</div>
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
