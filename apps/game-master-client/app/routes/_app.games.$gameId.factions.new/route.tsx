import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useParams } from "@remix-run/react";
import { useState } from "react";
import { CreateFactionForm } from "~/components/forms/create-faction";
import { Text } from "~/components/ui/typeography";
import { createFactionAction } from "~/queries/server/create-faction.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		return createFactionAction(request);
	}
};

export default function NewFactionRoute() {
	const params = useParams();
  const result = useActionData<typeof action>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  if (result) {
    setErrorMessage(result.errorMsg);
  }
	return (
		<div>
      <Text variant={"h3"}>{errorMessage}</Text>
			<CreateFactionForm gameId={params.gameId!} />
		</div>
	);
}
