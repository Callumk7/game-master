import { useTypedLoaderData } from "remix-typedjson";
import { CreateCharacterSlideover } from "~/components/forms/create-character";
import { CharacterTable } from "~/components/tables/character-table";
import type { loader } from "./route";

export function CharacterIndex() {
  const { gameId, gameChars } = useTypedLoaderData<typeof loader>();
  return (
    <div className="space-y-2">
      <CreateCharacterSlideover gameId={gameId} />
      <CharacterTable characters={gameChars} />
    </div>
  );
}
