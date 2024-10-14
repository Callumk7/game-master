import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { useGameData } from "../_app.games.$gameId/route";
import { duplicateCharacterSchema, updateCharacterSchema } from "@repo/api";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { EntityToolbar } from "~/components/entity-toolbar";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { charId } = parseParams(params, { charId: z.string() });
	const characterDetails = await api.characters.getCharacterWithPermissions(charId);
	return typedjson({ characterDetails });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { charId } = parseParams(params, { charId: z.string() });

	if (request.method === "POST") {
		const userId = await validateUser(request);
		const data = await parseForm(
			request,
			duplicateCharacterSchema.omit({ ownerId: true }),
		);

		const dupeResult = await api.characters.duplicateCharacter(charId, {
			...data,
			ownerId: userId,
		});

		if (!dupeResult.success) {
			return unsuccessfulResponse(dupeResult.message);
		}

		return redirect(`/games/${dupeResult.data.gameId}/characters/${dupeResult.data.id}`);
	}

	if (request.method === "PATCH") {
		const data = await parseForm(request, updateCharacterSchema);

		const result = await api.characters.updateCharacterDetails(charId, data);

		if (!result.success) {
			return new Response("Error");
		}

		return typedjson(result);
	}

	return methodNotAllowed();
};

export default function CharacterRoute() {
	const { characterDetails } = useTypedLoaderData<typeof loader>();
	const { suggestionItems } = useGameData();
	return (
		<div className="p-4 space-y-4">
			<EntityToolbar
				entityOwnerId={characterDetails.ownerId}
				gameId={characterDetails.gameId}
				entityVisibility={characterDetails.visibility}
				permissions={characterDetails.permissions}
			/>
			<EditableText
				method="patch"
				fieldName={"name"}
				value={characterDetails.name}
				variant={"h2"}
				weight={"semi"}
				inputLabel={"Game name input"}
				buttonLabel={"Edit game name"}
			/>
			<EditorBody
				htmlContent={characterDetails.htmlContent ?? ""}
				suggestionItems={suggestionItems}
			/>
		</div>
	);
}
