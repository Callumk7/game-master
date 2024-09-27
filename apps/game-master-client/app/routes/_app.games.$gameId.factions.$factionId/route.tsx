import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { useGameData } from "../_app.games.$gameId/route";
import { updateFactionSchema } from "@repo/api";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	const factionDetails = await api.factions.getFaction(factionId);
	return typedjson({ factionDetails });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
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
		<div>
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
