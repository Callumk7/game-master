import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { useGameData } from "../_app.games.$gameId/route";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	const factionDetails = await api.factions.getFaction(factionId);
	return typedjson({ factionDetails });
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	const { content, htmlContent } = await parseForm(request, {
		content: z.string(),
		htmlContent: z.string(),
	});

	const result = await api.factions.updateFactionDetails(factionId, {
		content,
		htmlContent,
	});

	return typedjson(result);
};

export default function FactionDetailRoute() {
	const { factionDetails } = useTypedLoaderData<typeof loader>();
	const { suggestionItems } = useGameData();
	return (
		<div>
			<Text variant={"h1"}>{factionDetails.name}</Text>
			<EditorBody
				htmlContent={factionDetails.htmlContent}
				suggestionItems={suggestionItems}
			/>
		</div>
	);
}
