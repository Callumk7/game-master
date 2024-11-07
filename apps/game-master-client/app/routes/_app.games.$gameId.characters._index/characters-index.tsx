import { useTypedLoaderData } from "remix-typedjson";
import { CharacterTable } from "~/components/tables/character-table";
import { CreateCharacterSlideover } from "./components/create-character-dialog";
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
