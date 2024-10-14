import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { useGameData } from "../_app.games.$gameId/route";
import { duplicateFactionSchema, updateFactionSchema } from "@repo/api";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { EntityToolbar } from "~/components/entity-toolbar";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	const factionDetails = await api.factions.getFactionWithPermissions(factionId);
	return typedjson({ factionDetails });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	if (request.method === "POST") {
		const userId = await validateUser(request);
		const data = await parseForm(request, duplicateFactionSchema.omit({ ownerId: true }));

		const dupeResult = await api.factions.duplicateFaction(factionId, {
			...data,
			ownerId: userId,
		});

		if (!dupeResult.success) {
			return unsuccessfulResponse(dupeResult.message);
		}

		return redirect(`/games/${dupeResult.data.gameId}/factions/${dupeResult.data.id}`);
	}
	if (request.method === "PATCH") {
		const data = await parseForm(request, updateFactionSchema);

		const result = await api.factions.updateFactionDetails(factionId, data);

		return typedjson(result);
	}
	return methodNotAllowed();
};

export default function FactionDetailRoute() {
	const { factionDetails } = useTypedLoaderData<typeof loader>();
	const { suggestionItems } = useGameData();
	return (
		<div className="p-4 space-y-4">
			<EntityToolbar
				entityOwnerId={factionDetails.ownerId}
				gameId={factionDetails.gameId}
				entityVisibility={factionDetails.visibility}
				permissions={factionDetails.permissions}
			/>
			<EditableText
				method="patch"
				fieldName={"name"}
				value={factionDetails.name}
				variant={"h2"}
				weight={"semi"}
				inputLabel={"Game name input"}
				buttonLabel={"Edit game name"}
			/>
			<EditorBody
				htmlContent={factionDetails.htmlContent}
				suggestionItems={suggestionItems}
			/>
		</div>
	);
}
