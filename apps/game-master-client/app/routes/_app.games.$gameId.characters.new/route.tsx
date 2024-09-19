import type { ActionFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { CreateCharacterForm } from "~/components/forms/create-character";
import { createCharacterAction } from "~/queries/create-character";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		return createCharacterAction(request);
	}
};

export default function NewCharacterRoute() {
	const params = useParams();
	return (
		<div>
			<CreateCharacterForm gameId={params.gameId!} />
		</div>
	);
}
