import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { loader } from "./route";
import { Header } from "~/components/typeography";
import { useFetcher, useSubmit } from "@remix-run/react";
import { Select, SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { EntityListBox } from "~/components/entity-listbox";
import { Character } from "@repo/db";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";

export default function FactionView() {
	const { faction, allCharacters } = useTypedLoaderData<typeof loader>();
	const fetcher = useFetcher();
	return (
		<EntityView>
			<EntityHeader title={faction.name} />
			<div className="space-y-4">
				<Header style="h2">Members</Header>
				<fetcher.Form className="flex gap-4" method="POST">
					<Select items={allCharacters} name="characterIds">
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</Select>
					<Button type="submit">Add to {faction.name}</Button>
				</fetcher.Form>
				<MembersList characters={faction.members.map((m) => m.character)} />
			</div>
		</EntityView>
	);
}

function MembersList({
	characters,
	className,
}: { characters: Character[]; className?: string }) {
	const submit = useSubmit();
	return (
		<ListBox
			items={characters}
			className={className}
			aria-label="Members"
			onAction={(key) => submit({ characterId: key.toString() }, { method: "DELETE" })}
		>
			{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
		</ListBox>
	);
}
