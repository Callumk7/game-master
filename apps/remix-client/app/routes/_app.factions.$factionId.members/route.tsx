import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { noContent, OptionalEntitySchema, LINK_INTENT } from "@repo/db";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { extractParam } from "~/lib/zx-util";
import { useAppData } from "../_app/route";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { MemberTable, updateMemberDetailsSchema } from "./components/member-table";
import { zx } from "zodix";
import { z } from "zod";
import { handleBulkUpdateMembers, handleUpdateMember } from "./queries.server";
import { DialogTrigger, type Key } from "react-aria-components";
import { Popover } from "~/components/ui/popover";
import { Dialog } from "~/components/ui/dialog";
import { EntitySelectCard } from "~/components/entity-select-card";
import { useState } from "react";
import { Container } from "~/components/layout";

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
	if (submission.intent === LINK_INTENT.CHARACTERS) {
		return await handleBulkUpdateMembers(request, context, factionId);
	}
	return noContent();
};

export default function FactionMembersView() {
	const { faction } = useFactionRouteData();
	return (
		<Container width="max" className="space-y-4">
			<Header style="h2">Faction Members</Header>
			<MemberTable members={faction.members} factionId={faction.id} />
			<AddMembersPopover />
		</Container>
	);
}

export const bulkUpdateMembersSchema = z.object({
	intent: z.literal(LINK_INTENT.CHARACTERS),
	linkIds: OptionalEntitySchema,
});

function AddMembersPopover() {
	const { allCharacters } = useAppData();
	const { faction } = useFactionRouteData();
	const initChars = new Set(faction.members.map((f) => f.characterId as Key));
	const [linkedChars, setLinkedChars] = useState(initChars);
	return (
		<DialogTrigger>
			<Button>Add</Button>
			<Popover>
				<Dialog>
					{({ close }) => (
						<EntitySelectCard
							targetEntityId={faction.id}
							targetEntityType={"factions"}
							allEntities={allCharacters}
							selectedEntities={linkedChars}
							setSelectedEntites={setLinkedChars}
							intent={LINK_INTENT.CHARACTERS}
							action=""
							close={close}
						/>
					)}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
