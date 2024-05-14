import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { zx } from "zodix";
import { z } from "zod";
import { extractParam } from "~/lib/zx-util";
import { put } from "~/lib/game-master";
import { CharacterFactionTable } from "./components/faction-table";
import { ReactNode } from "react";
import { Header } from "~/components/typeography";
import { CharacterAllyTable } from "./components/ally-table";

// Creating a link, through an action - mostly we
// just want to route the same request to the backend server - with whatever
// context that we need
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
	const { factionId } = await zx.parseForm(request, { factionId: z.string() });
	const form = await request.formData();

	const res = await put(context, `factions/${factionId}/members/${characterId}`, form);

	return null;
};

export default function CharacterLinksRoute() {
	return (
		<div className="space-y-10">
			<TableSection header="Factions">
				<CharacterFactionTable />
			</TableSection>

			<TableSection header="Allies">
				<CharacterAllyTable />
			</TableSection>
		</div>
	);
}

function TableSection({ children, header }: { children: ReactNode; header: string }) {
	return (
		<div className="space-y-4">
			<Header style="h3">{header}</Header>
			{children}
		</div>
	);
}
