import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit, Outlet } from "@remix-run/react";
import { EntityView, EntityHeader } from "~/components/layout";
import { loader } from "./route";
import { Button } from "~/components/ui/button";
import { useTypedLoaderData } from "remix-typedjson";
import { Link } from "~/components/ui/link";

export function CharacterView() {
	const { characterData } = useTypedLoaderData<typeof loader>();

	const submit = useSubmit();

	return (
		<EntityView margin top>
			<Button
				size="sm"
				variant="destructive"
				onPress={() => submit({}, { method: "DELETE" })}
			>
				<TrashIcon />
			</Button>
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
