import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody, EditorPreview } from "~/components/editor";
import { EditableText } from "~/components/ui/typeography";
import { useGameData } from "../_app.games.$gameId/route";
import { duplicateCharacterSchema, updateCharacterSchema } from "@repo/api";
import { methodNotAllowed, unsuccessfulResponse } from "~/util/responses";
import { validateUser } from "~/lib/auth.server";
import { createApi } from "~/lib/api.server";
import { useCharacterData } from "../_app.games.$gameId.characters.$charId/route";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await validateUser(request);
  const api = createApi(userId);
  const { charId } = parseParams(params, { charId: z.string() });
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
  const { characterDetails } = useCharacterData();
  const { suggestionItems } = useGameData();
  return (
    <div className="p-4 space-y-4">
      <EditableText
        method="patch"
        fieldName={"name"}
        value={characterDetails.name}
        variant={"h2"}
        weight={"semi"}
        inputLabel={"Game name input"}
        buttonLabel={"Edit game name"}
      />
      {characterDetails.userPermissionLevel === "view" ? (
        <>
          <span className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2 py-[4px] ">
            You have permission to view
          </span>
          <EditorPreview htmlContent={characterDetails.htmlContent ?? ""} />
        </>
      ) : (
        <EditorBody
          htmlContent={characterDetails.htmlContent ?? ""}
          suggestionItems={suggestionItems}
        />
      )}
    </div>
  );
}
