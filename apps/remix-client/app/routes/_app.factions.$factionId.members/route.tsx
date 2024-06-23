import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { noContent, type Character, OptionalEntitySchema } from "@repo/db";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxGroup } from "~/components/ui/checkbox";
import { extractParam } from "~/lib/zx-util";
import { useAppData } from "../_app/route";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { MemberTable, updateMemberDetailsSchema } from "./components/member-table";
import { zx } from "zodix";
import { z } from "zod";
import { handleBulkUpdateMembers, handleUpdateMember } from "./queries.server";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	console.log("here");
	const factionId = extractParam("factionId", params);
	const submission = await zx.parseForm(
		request,
		z.discriminatedUnion("intent", [updateMemberDetailsSchema, bulkUpdateMembersSchema]),
	);

	if (submission.intent === "UPDATE_MEMBER") {
		return await handleUpdateMember(request, context, factionId, submission.characterId);
	}
	if (submission.intent === "BULK_UPDATE") {
		return await handleBulkUpdateMembers(request, context, factionId);
	}
	return noContent();
};

export default function FactionMembersView() {
	const { allCharacters } = useAppData();
	const { faction } = useFactionRouteData();
	return (
		<div>
			<Header style="h2">Faction Members</Header>
			<MemberTable members={faction.members} factionId={faction.id} />
			<AddMembersForm characters={allCharacters} />
		</div>
	);
}

export const bulkUpdateMembersSchema = z.object({
	intent: z.literal("BULK_UPDATE"),
	factionId: z.string(),
	linkIds: OptionalEntitySchema,
});

// TODO: this needs to be redone to align with how we do it elsewhere
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
