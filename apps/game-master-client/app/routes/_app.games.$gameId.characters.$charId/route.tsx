import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { charId } = parseParams(params, { charId: z.string() });
	const characterDetails = await api.characters.getCharacter(charId);
	return typedjson({ characterDetails });
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { charId } = parseParams(params, { charId: z.string() });
	const { content, htmlContent } = await parseForm(request, {
		content: z.string(),
		htmlContent: z.string(),
	});

	const result = await api.characters.updateCharacterDetails(charId, {
		content,
		htmlContent,
	});

  return typedjson(result);
};

export default function CharacterRoute() {
	const { characterDetails } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<Text variant={"h1"}>{characterDetails.name}</Text>
			<EditorBody htmlContent={characterDetails.htmlContent} />
		</div>
	);
}
