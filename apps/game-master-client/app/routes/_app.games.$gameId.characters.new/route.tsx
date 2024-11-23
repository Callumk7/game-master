import type { ActionFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { CreateCharacterForm } from "~/components/forms/character-forms";
import { createCharacterAction } from "~/queries/server/create-character.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return createCharacterAction(request);
};

export default function NewCharacterRoute() {
  const params = useParams();
  return (
    <div>
      <CreateCharacterForm gameId={params.gameId!} />
    </div>
  );
}
