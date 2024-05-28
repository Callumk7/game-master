import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { noContent, type Character, LINK_INTENT } from "@repo/db";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxGroup } from "~/components/ui/checkbox";
import { extractParam } from "~/lib/zx-util";
import { useAppData } from "../_app/route";
import { post, put } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const factionId = extractParam("factionId", params);
	const form = await request.formData();
	const memberIds = form.getAll("memberIds");
	memberIds.forEach((id) => form.append("linkIds", id.toString()));
	form.append("intent", LINK_INTENT.CHARACTERS);
	const res = await put(context, `factions/${factionId}/links`, form);
	return noContent();
};

export default function FactionMembersView() {
	const { allCharacters } = useAppData();
	return (
		<div>
			<Header style="h2">Manage Members</Header>
			<AddMembersForm characters={allCharacters} />
		</div>
	);
}

function AddMembersForm({ characters }: { characters: Character[] }) {
	return (
		<Form className="space-y-3" method="PUT">
			<CheckboxGroup name="memberIds">
				{characters.map((char) => (
					<Checkbox value={char.id} key={char.id}>
						{char.name}
					</Checkbox>
				))}
			</CheckboxGroup>
			<Button type="submit">Add</Button>
		</Form>
	);
}