import { useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components/container";
import { CreateCharacterSlideover } from "~/components/forms/create-character-dialog";
import { CharacterTable } from "~/components/tables/character-table";
import type { loader } from "./route";

export function CharacterIndex() {
  const { gameId, gameChars } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateCharacterSlideover gameId={gameId} />
      <CharacterTable characters={gameChars} />
    </Container>
  );
}
