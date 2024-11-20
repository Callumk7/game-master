import { useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components/container";
import { CreateFolderSlideover } from "~/components/forms/create-folder-dialog";
import { FolderTable } from "~/components/tables/folder-table";
import type { loader } from "./route";

export default function FolderIndex() {
  const { folders, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateFolderSlideover gameId={gameId} folders={folders} />
      <FolderTable folders={folders} />
    </Container>
  );
}