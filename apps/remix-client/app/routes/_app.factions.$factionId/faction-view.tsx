import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView } from "~/components/layout";
import { loader } from "./route";
import { Header } from "~/components/typeography";
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { Select, SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { EntityListBox } from "~/components/entity-listbox";
import { Character } from "@repo/db";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";
import { useAppData } from "../_app/route";

export default function FactionView() {
	const { faction } = useTypedLoaderData<typeof loader>();
	const { allCharacters } = useAppData();
	const fetcher = useFetcher();
	return (
		<EntityView>
			<EntityHeader title={faction.name}>
				{faction.leader ? (
					<div>
						<p>Leader: {faction.leader.name}</p>
					</div>
				) : (
					<Form method="POST" className="flex gap-2 items-center">
						<Select
							name="leaderId"
							items={faction.members.map((char) => char.character)}
							placeholder="Select faction leader"
							className={"w-fit"}
						>
							{(item) => <SelectItem>{item.name}</SelectItem>}
						</Select>
						<input type="hidden" value="leader" name="intent" />
						<Button type="submit" size="icon">
							Go
						</Button>
					</Form>
				)}
			</EntityHeader>
			<div className="space-y-4">
				<Header style="h2">Members</Header>
				<fetcher.Form className="flex gap-4" method="POST">
					<Select items={allCharacters} name="characterIds">
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</Select>
					<Button type="submit">Add to {faction.name}</Button>
					<input type="hidden" value="members" name="intent" />
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
