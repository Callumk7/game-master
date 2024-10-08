import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useParams } from "@remix-run/react";
import { useState } from "react";
import { CreateCharacterForm } from "~/components/forms/create-character";
import { Text } from "~/components/ui/typeography";
import { createCharacterAction } from "~/queries/server/create-character.server";


export const action = async ({ request }: ActionFunctionArgs) => {
  return createCharacterAction(request);
};

export default function NewCharacterRoute() {
  const params = useParams();
  const result = useActionData<typeof action>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  if (result) {
    setErrorMessage(result.errorMsg);
  }
  return (
    <div>
      <Text variant={"h3"}>{errorMessage}</Text>
      <CreateCharacterForm gameId={params.gameId!} />
    </div>
  );
}
