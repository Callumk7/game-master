import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit, Outlet } from "@remix-run/react";
import { EntityView, EntityHeader } from "~/components/layout";
import { loader } from "./route";
import { Button } from "~/components/ui/button";
import { useTypedLoaderData } from "remix-typedjson";

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
				<div className="flex gap-6 border-t border-grade-6 pt-2">
					<p>
						<span className="font-semibold">Class:</span> {characterData.class}
					</p>
					<p>
						<span className="font-semibold">Level:</span> {characterData.level}
					</p>
				</div>
			</EntityHeader>
			<Outlet />
		</EntityView>
	);
}
