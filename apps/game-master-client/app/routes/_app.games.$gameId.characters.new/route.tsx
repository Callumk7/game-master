import type { ActionFunctionArgs } from "react-router";
import { useParams } from "react-router";
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
