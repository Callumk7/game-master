import type { ActionFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { CreateFactionForm } from "~/components/forms/create-faction";
import { createFactionAction } from "~/queries/create-faction";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		return createFactionAction(request);
	}
};


export default function NewFactionRoute() {
	const params = useParams();
	return (
		<div>
			<CreateFactionForm gameId={params.gameId!} />
		</div>
	);
}
