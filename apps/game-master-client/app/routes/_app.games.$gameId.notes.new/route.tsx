import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import { validateUser } from "~/lib/auth.server";
import { CreateNoteForm } from "~/components/forms/create-note";
import { createNoteAction } from "~/queries/create-note";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const userId = await validateUser(request);
	return json({ userId, gameId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		return await createNoteAction(request);
	}

	return methodNotAllowed();
};

export default function NewNoteRoute() {
	const { gameId } = useLoaderData<typeof loader>();
	return (
		<div>
			<CreateNoteForm gameId={gameId} />
		</div>
	);
}
