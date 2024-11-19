import { useTypedLoaderData } from "remix-typedjson";
import { CharacterTable } from "~/components/tables/character-table";
import type { loader } from "./route";
import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { Container } from "~/components/container";

export function CharacterIndex() {
  const { gameId, gameChars } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateCharacterSlideover gameId={gameId} />
      <CharacterTable characters={gameChars} />
    </Container>
  );
}
