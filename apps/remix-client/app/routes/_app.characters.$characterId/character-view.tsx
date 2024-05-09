import { TrashIcon } from "@radix-ui/react-icons";
import { useSubmit, Outlet, useLoaderData, Form } from "@remix-run/react";
import { EntityView, EntityHeader } from "~/components/layout";
import { loader } from "./route";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/typeography";
import { TextField } from "~/components/ui/text-field";

export function CharacterView() {
	const character = useLoaderData<typeof loader>().characterData;

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
			<EntityHeader title={character.name}>
				<div className="flex gap-6 border-t border-grade-6 pt-2">
					<p>
						<span className="font-semibold">Class:</span> {character.class}
					</p>
					<p>
						<span className="font-semibold">Level:</span> {character.level}
					</p>
				</div>
			</EntityHeader>
			<Outlet />
			<Header>Create a faction</Header>
			<Form method="POST">
				<div className="flex flex-col gap-5">
					<TextField label="name" name="name" />
					<TextField textarea label="description" name="description" />
					<Button type="submit">Create</Button>
				</div>
			</Form>
		</EntityView>
	);
}
