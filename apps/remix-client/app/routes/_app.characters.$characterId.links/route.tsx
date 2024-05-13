import { HeaderLink } from "~/components/typeography";
import { useAppData } from "../_app/route";
import { Key } from "react-aria-components";
import { useState } from "react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { zx } from "zodix";
import { z } from "zod";
import ky from "ky";
import { LINK_INTENT } from "@repo/db";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { EntitySelectCard } from "~/components/entity-select-card";

// Creating a link, through an action - mostly we
// just want to route the same request to the backend server - with whatever
// context that we need
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { characterId } = zx.parseParams(params, { characterId: z.string() });
	const form = await request.formData();

	const res = await ky.put(
		`${context.cloudflare.env.GAME_MASTER_URL}/characters/${characterId}/links`,
		{ body: form },
	);

	return null;
};

export default function CharacterLinksRoute() {
	const { allFactions } = useAppData();
	const { characterData } = useCharacterRouteData();

	const [factions, setFactions] = useState(
		new Set(characterData.factions.map((f) => f.factionId as Key)),
	);
	return (
		<>
			<div className="grid grid-cols-3">
				<div className="border border-grade-6 rounded-lg p-3">
					<HeaderLink to="/factions" style="h2" link="primary">
						Factions
					</HeaderLink>
					<EntitySelectCard
						targetEntityId={characterData.id}
						targetEntityType={"factions"}
						allEntities={allFactions}
						selectedEntities={factions}
						setSelectedEntites={setFactions}
						intent={LINK_INTENT.FACTIONS}
						action=""
					/>
				</div>
			</div>
		</>
	);
}
